import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
import pytz
from datetime import datetime

app = Flask(__name__, template_folder='D:/xampp/htdocs/GlamTech/appointment', static_folder='D:/xampp/htdocs/GlamTech/appointment')
CORS(app)  # Enable CORS for all routes

# Data for services and corresponding staff members
services = [
    'brazilian', 'cellophane', 'coldwave', 'eyebrowshave', 'footmassage',
    'footspa', 'gelpolish', 'gelpolishmanicure', 'gelpolishpedicure', 'haircut',
    'haircolor', 'haircurl', 'hairiron', 'hairmask', 'hairspa', 'hairtreatment',
    'hairwithmakeup', 'highlights', 'hotoil', 'manicure', 'pedicure',
    'premiumfootspa', 'rebond', 'shampoowithblowdry', 'semidlino'
]

staff_data = {
   'brazilian': ['Marilyn'],
    'cellophane': ['Wendell', 'Jirven', 'Joane', 'Marilyn'],
    'coldwave': ['Wendell', 'Jirven', 'Joane', 'Marilyn'],
    'eyebrowshave': ['Marilyn'],
    'footmassage': ['Rosalie', 'Mernalyn', 'Marilyn'],
    'footspa': ['Rosalie', 'Mernalyn', 'Marilyn'],
    'gelpolish': ['Rosalie', 'Mernalyn', 'Marilyn'],
    'gelpolishmanicure': ['Rosalie', 'Mernalyn', 'Marilyn'],
    'gelpolishpedicure': ['Rosalie', 'Mernalyn', 'Marilyn'],
    'haircut': ['Wendell', 'Jirven', 'Joane', 'Marilyn'],
    'haircolor': ['Wendell', 'Jirven', 'Joane', 'Marilyn'],
    'haircurl': ['Marilyn'],
    'hairiron': ['Wendell', 'Jirven', 'Joane', 'Marilyn'],
    'hairmask': ['Wendell', 'Jirven', 'Joane', 'Marilyn'],
    'hairspa': ['Wendell', 'Jirven', 'Joane', 'Marilyn'],
    'hairtreatment': ['Marilyn'],
    'hairwithmakeup': ['Marilyn'],
    'highlights': ['Wendell', 'Jirven', 'Joane', 'Marilyn'],
    'hotoil': ['Wendell', 'Jirven', 'Joane', 'Marilyn'],
    'manicure': ['Rosalie', 'Mernalyn', 'Marilyn'],
    'pedicure': ['Rosalie', 'Mernalyn', 'Marilyn'],
    'premiumfootspa': ['Rosalie', 'Mernalyn', 'Marilyn'],
    'rebond': ['Marilyn'],
    'shampoowithblowdry': ['Wendell', 'Jirven', 'Joane', 'Marilyn'],
    'semidlino': ['Wendell', 'Jirven', 'Joane', 'Marilyn']
}

staff_expertise = {
    'Marilyn': 'All Rounder',
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
            for feedback in feedbacks:
                # Convert feedback time to Philippine Time (PHT)
                utc_time = datetime.strptime(feedback['date_time'], '%Y-%m-%d %H:%M:%S')
                utc_time = utc_time.replace(tzinfo=pytz.utc)
                pht_time = utc_time.astimezone(pytz.timezone('Asia/Manila'))
                feedback['date_time'] = pht_time.strftime('%Y-%m-%d %H:%M:%S')
            if ratings:
                return sum(ratings) / len(ratings), feedbacks  # Calculate average rating and return feedbacks
    except Exception as e:
        app.logger.error(f"Error fetching ratings for {staff_name}: {e}")
    return None, []

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
                best_feedbacks = []

                for staff_name in available_staff:
                    rating, feedbacks = fetch_staff_ratings(staff_name)
                    if rating is not None and rating > best_rating:
                        best_staff = staff_name
                        best_rating = rating
                        best_feedbacks = feedbacks
                
                if best_staff:
                    recommendations.append({
                        'name': best_staff,
                        'expertise': staff_expertise.get(best_staff, 'Unknown'),
                        'rating': best_rating,
                        'feedbacks': best_feedbacks  # Include feedbacks in the response
                    })

        except Exception as e:
            app.logger.error(f"Error processing service '{service}': {e}")
    
    return jsonify(recommendations=recommendations)

if __name__ == '__main__':
    app.run(debug=True)
