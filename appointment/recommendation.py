import os
from flask import Flask, render_template, request, jsonify
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier

app = Flask(__name__, template_folder='D:/xampp/htdocs/GlamTech/appointment', static_folder='D:/xampp/htdocs/GlamTech/appointment')

# Data for services and corresponding staff members
services = [
    'haircut', 'shampoowithblowdry', 'hairiron', 'haircolor', 'highlights',
    'manicure', 'pedicure', 'gelpolishmanicure', 'gelpolish', 'footspa',
    'premiumfootspa', 'hotoil', 'hairmask', 'hairspa', 'semidlino', 'cellophane',
    'coldwave'
]

staff_data = {
    'haircut': ['Wendell', 'Jirven', 'Joane'],
    'shampoowithblowdry': ['Wendell', 'Jirven', 'Joane'],
    'hairiron': ['Wendell', 'Jirven', 'Joane'],
    'haircolor': ['Wendell', 'Jirven', 'Joane'],
    'highlights': ['Wendell', 'Jirven', 'Joane'],
    'manicure': ['Rosalie', 'Mernalyn'],
    'pedicure': ['Rosalie', 'Mernalyn'],
    'gelpolishmanicure': ['Rosalie', 'Mernalyn'],
    'gelpolish': ['Rosalie', 'Mernalyn'],
    'footspa': ['Rosalie', 'Mernalyn'],
    'premiumfootspa': ['Rosalie', 'Mernalyn'],
    'hotoil': ['Wendell', 'Jirven', 'Joane'],
    'hairmask': ['Wendell', 'Jirven', 'Joane'],
    'hairspa': ['Wendell', 'Jirven', 'Joane'],
    'semidlino': ['Wendell', 'Jirven', 'Joane'],
    'cellophane': ['Wendell', 'Jirven', 'Joane'],
    'coldwave': ['Wendell', 'Jirven', 'Joane']
}

# Encoding categorical data
encoder = LabelEncoder()
encoder.fit(services)
X_encoded = encoder.transform(services)

# Mapping encoded services to staff using DecisionTreeClassifier
clf = DecisionTreeClassifier()
clf.fit(X_encoded.reshape(-1, 1), services)

@app.route('/')
def index():
    return render_template('user_appointment.html')

@app.route('/recommend-staff', methods=['POST'])
def recommend_staff():
    selected_services = request.json.get('services', [])
    print(f"Selected services: {selected_services}")  # Debug log
    
    recommendations = []
    for service in selected_services:
        encoded_service = encoder.transform([service])[0]
        predicted_service = clf.predict([[encoded_service]])[0]
        available_staff = staff_data.get(predicted_service, [])
        if available_staff:
            recommendations.append(available_staff[0])  # Recommend only one staff member per service
    
    print(f"Recommendations: {recommendations}")  # Debug log
    return jsonify(recommendations=recommendations)

if __name__ == '__main__':
    app.run(debug=True)
