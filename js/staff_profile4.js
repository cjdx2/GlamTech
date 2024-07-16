document.addEventListener('DOMContentLoaded', function() {
    fetch('../php/get_user_session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                document.getElementById('username').innerText = data.username;
                document.getElementById('profile-picture').src = data.profile_picture;
                document.getElementById('hidden-username').value = data.username;
            }
        });
});

let feedbacks = [];
let currentPage = 1;
const feedbacksPerPage = 5;

const bannedWords = ['putangina', 'gago', 'gaga', 'tangina', 'leche', 'bobo', 'ulol', 'tarantado', 'hayop ka', 'lintik', 'bwisit', 'kupal', 'damn', 'hell', 'shit', 'asshole', 'bitch', 'bastard', 'fuck', 'motherfucker', 'prick', 'shithead', 'son of a bitch'];

    function containsBannedWords(text) {
        return bannedWords.some(word => text.toLowerCase().includes(word));
    }

    document.querySelector('#feedbackForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const rating = document.querySelector('input[name="rating"]:checked');
        const feedbackText = document.getElementById('feedback').value;
        
        if (rating && feedbackText) {
            if (containsBannedWords(feedbackText)) {
                alert('Your feedback contains inappropriate language. Please remove it.');
                return;
            }

            const formData = new FormData();
            formData.append('rating', rating.value);
            formData.append('comment', feedbackText);

            fetch('../php/save_feedback_jirven.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    feedbacks.unshift(data.feedback); // Add feedback to the beginning
                    document.getElementById('feedback').value = '';
                    document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);

                    displayFeedback(currentPage);
                    displayAverageRating();
                } else {
                    alert('Error saving feedback: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            alert('Please provide a rating and feedback.');
        }
    });

function displayFeedback(page) {
    const feedbackContainer = document.getElementById('feedback-container');
    feedbackContainer.innerHTML = '';

    const start = (page - 1) * feedbacksPerPage;
    const end = start + feedbacksPerPage;
    const paginatedFeedbacks = feedbacks.slice(start, end);

    paginatedFeedbacks.forEach(feedback => {
        const feedbackElement = document.createElement('div');
        feedbackElement.classList.add('feedback-item');
        
        const userProfile = document.createElement('div');
        userProfile.classList.add('user-profile');
        const userImage = document.createElement('img');
        userImage.src = feedback.profile_picture || '../img/defaultprofile.jpg';  // Use the profile picture from feedback
        userImage.alt = 'User Profile';
        userProfile.appendChild(userImage);

        const userNameElement = document.createElement('span');
        userNameElement.classList.add('user-name');
        userNameElement.textContent = feedback.username;
        userProfile.appendChild(userNameElement);
        
        const starRating = document.createElement('div');
        starRating.classList.add('star-rating');
        for (let i = 4; i >= 0; i--) {
            const star = document.createElement('span');
            star.classList.add('star');
            star.innerHTML = i < feedback.star_rating ? '&#9733;' : '&#9734;';
            starRating.appendChild(star);
        }

        const feedbackTextElement = document.createElement('p');
        feedbackTextElement.classList.add('feedback-text');
        feedbackTextElement.innerText = feedback.comment;

        const dateTimeElement = document.createElement('p');
        dateTimeElement.classList.add('date-time');
        dateTimeElement.innerText = feedback.date_time;
        
        feedbackElement.appendChild(userProfile);
        feedbackElement.appendChild(starRating);
        feedbackElement.appendChild(feedbackTextElement);
        feedbackElement.appendChild(dateTimeElement);
        
        feedbackContainer.appendChild(feedbackElement);
    });

    displayPagination();
}

function displayPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.classList.add('page-button');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', function() {
            currentPage = i;
            displayFeedback(currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }
}

function initializePage() {
    fetch('../php/insert_jirven.php')
    .then(response => response.json())
    .then(data => {
        feedbacks = data;
        displayFeedback(currentPage);
        displayAverageRating();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

initializePage();

function calculateAverageRating() {
    if (feedbacks.length === 0) return 0;
    const totalRatings = feedbacks.reduce((acc, feedback) => acc + parseInt(feedback.star_rating), 0);
    const averageRating = totalRatings / feedbacks.length;
    return averageRating;
}

function displayAverageRating() {
    const averageRating = calculateAverageRating();
    const ratingElement = document.querySelector('.rating');
    ratingElement.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        star.innerHTML = i <= averageRating ? '&#9733;' : '&#9734;';
        ratingElement.appendChild(star);
    }
}

// Back button functionality
document.querySelector('.back-button').addEventListener('click', function() {
    window.history.back();
});
