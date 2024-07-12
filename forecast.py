# forecast.py
from flask import Flask, jsonify, request
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


data = {
    "2021": [186, 156, 186, 180, 186, 180, 186, 186, 210, 217, 216, 248],
    "2022": [496, 420, 496, 480, 496, 480, 496, 496, 540, 558, 552, 589],
    "2023": [558, 504, 651, 630, 651, 630, 651, 651, 750, 755, 800, 900],
    "2024": [825, 780, 850, 800, 835, 815]  # Only first 6 months of 2024
}

# Convert the data to a pandas DataFrame
data_flat = [value for sublist in data.values() for value in sublist]
dates = pd.date_range(start='2021-01-01', periods=len(data_flat), freq='M')
df = pd.DataFrame(data_flat, index=dates, columns=['customer_volume'])

# Train the ARIMA model
model = ARIMA(df['customer_volume'], order=(5, 1, 0))
model_fit = model.fit()

@app.route('/forecast', methods=['GET'])
def forecast():
    year = request.args.get('year')
    if year not in ['2025', '2026', '2027']:
        return jsonify({"error": "Year not in forecast range"}), 404

    # Calculate how many months into the future we need to forecast
    start_year = 2025
    months_into_future = (int(year) - start_year) * 12

    # Forecast the next months_into_future + 12 months to get the full year's forecast
    forecast = model_fit.forecast(steps=months_into_future + 12)
    
    # Extract the forecast for the requested year
    forecast_for_year = forecast[-12:].tolist()

    return jsonify(forecast_for_year)

if __name__ == '__main__':
    app.run(debug=True)
