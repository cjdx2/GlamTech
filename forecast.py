from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the data from the Excel file
df = pd.read_excel('./excel/customer_volume.xlsx', index_col=0)

# Flatten the data
data_flat = df.values.flatten()
dates = pd.date_range(start='2021-01-01', periods=len(data_flat), freq='ME')  # Updated to 'ME'
df_flat = pd.DataFrame(data_flat, index=dates, columns=['customer_volume'])

# Function to create Fourier terms
def fourier_series(df, period=12, num_terms=6):  # Increase num_terms to 6
    for i in range(1, num_terms + 1):
        df[f'sin_{i}'] = np.sin(2 * np.pi * i * df.index.month / period)
        df[f'cos_{i}'] = np.cos(2 * np.pi * i * df.index.month / period)
    return df

# Add Fourier terms to the dataframe
df_flat = fourier_series(df_flat)

# Fit ARIMA with Fourier terms
exog = df_flat[[col for col in df_flat.columns if 'sin_' in col or 'cos_' in col]]
model = ARIMA(df_flat['customer_volume'], order=(5, 1, 0), exog=exog)
model_fit = model.fit()

@app.route('/forecast', methods=['GET'])
def forecast():
    year = request.args.get('year')
    if year not in ['2024', '2025']:
        return jsonify({"error": "Year not in forecast range"}), 404

    if year == '2024':
        steps = 6  # Forecast from July to December
        labels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    elif year == '2025':
        steps = 12  # Forecast for the entire year
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    # Generate future Fourier terms
    future_dates = pd.date_range(start='2024-01-01', periods=steps, freq='ME')
    future_df = pd.DataFrame(index=future_dates)
    future_df = fourier_series(future_df)
    
    # Forecast the data
    forecast = model_fit.get_forecast(steps=steps, exog=future_df)
    forecast_values = forecast.predicted_mean

    # Return the forecasted data
    forecast_for_year = {
        "labels": labels,
        "data": forecast_values.tolist()
    }
    
    return jsonify(forecast_for_year)

if __name__ == '__main__':
    app.run(debug=True)
