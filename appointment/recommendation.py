import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier

app = Flask(__name__, template_folder='D:/xampp/htdocs/GlamTech/appointment', static_folder='D:/xampp/htdocs/GlamTech/appointment')
CORS(app)  # Enable CORS for all routes

# Data for services and corresponding staff members
services = [
    'haircut', 'shampoowithblowdry', 'hairiron', 'haircolor', 'highlights',
    'manicure', 'pedicure', 'gelpolishmanicure', 'gelpolish', 'footspa',
    'premiumfootspa', 'hotoil', 'hairmask', 'hairspa', 'semidlino', 'cellophane',
    'coldwave'
]

staff_data = {
    'haircut': ['Wendel', 'Jirven', 'Joane'],
    'shampoowithblowdry': ['Wendel', 'Jirven', 'Joane'],
    'hairiron': ['Wendel', 'Jirven', 'Joane'],
    'haircolor': ['Wendel', 'Jirven', 'Joane'],
    'highlights': ['Wendel', 'Jirven', 'Joane'],
    'manicure': ['Rosalie', 'Mernalyn'],
    'pedicure': ['Rosalie', 'Mernalyn'],
    'gelpolishmanicure': ['Rosalie', 'Mernalyn'],
    'gelpolish': ['Rosalie', 'Mernalyn'],
    'footspa': ['Rosalie', 'Mernalyn'],
    'premiumfootspa': ['Rosalie', 'Mernalyn'],
    'hotoil': ['Wendel', 'Jirven', 'Joane'],
    'hairmask': ['Wendel', 'Jirven', 'Joane'],
    'hairspa': ['Wendel', 'Jirven', 'Joane'],
    'semidlino': ['Wendel', 'Jirven', 'Joane'],
    'cellophane': ['Wendel', 'Jirven', 'Joane'],
    'coldwave': ['Wendel', 'Jirven', 'Joane']
}

staff_expertise = {
    'Wendel': 'Hairdresser',
    'Jirven': 'Hairdresser',
    'Joane': 'Hairdresser',
    'Rosalie': 'Manicurist',
    'Mernalyn': 'Manicurist'
}

# Encoding categorical data
encoder = LabelEncoder()
encoder.fit(services)
X_encoded = encoder.transform(services)

# Mapping encoded services to staff using DecisionTreeClassifier
clf = DecisionTreeClassifier()
clf.fit(X_encoded.reshape(-1, 1), services)

# Function to fetch staff ratings from PHP endpoints
def fetch_staff_ratings(staff_name):
    try:
        url = f'http://localhost/GlamTech/php/get_feedback_{staff_name.lower()}.php'
        response = requests.get(url)
        if response.status_code == 200:
            feedbacks = response.json()
            ratings = [float(feedback['star_rating']) for feedback in feedbacks]
            if ratings:
                return sum(ratings) / len(ratings)  # Calculate average rating
    except Exception as e:
        app.logger.error(f"Error fetching ratings for {staff_name}: {e}")
    return None

# Route to recommend staff based on selected services
@app.route('/recommend-staff', methods=['POST'])
def recommend_staff():
    selected_services = request.json.get('services', [])

    recommendations = []
    for service in selected_services:
        try:
            encoded_service = encoder.transform([service])[0]
            predicted_service = clf.predict([[encoded_service]])[0]
            available_staff = staff_data.get(predicted_service, [])
            
            if available_staff:
                best_staff = None
                best_rating = -1  # Initialize with a low rating

                for staff_name in available_staff:
                    rating = fetch_staff_ratings(staff_name)
                    if rating is not None and rating > best_rating:
                        best_staff = staff_name
                        best_rating = rating
                
                if best_staff:
                    recommendations.append({
                        'name': best_staff,
                        'expertise': staff_expertise.get(best_staff, 'Unknown'),
                        'rating': best_rating
                    })

        except Exception as e:
            app.logger.error(f"Error processing service '{service}': {e}")
    
    return jsonify(recommendations=recommendations)

if __name__ == '__main__':
    app.run(debug=True)
