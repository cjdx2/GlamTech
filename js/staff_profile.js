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
let currentFilter = 'all';

const bannedWords = ['putangina', 'gago', 'gaga', 'tangina', 'leche', 'bobo', 'ulol', 'tarantado', 'hayop ka', 'lintik', 'bwisit', 'kupal', 'damn', 'hell', 'shit', 'asshole', 'bitch', 'bastard', 'fuck', 'motherfucker', 'prick', 'shithead', 'son of a bitch', 'kinginamerls', 'shuta'];

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

        fetch('../php/save_feedback_rosalie.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                feedbacks.unshift(data.feedback);
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

function filterFeedbacks() {
    return currentFilter === 'all' ? feedbacks : feedbacks.filter(feedback => feedback.star_rating === currentFilter);
}

function displayFeedback(page) {
    const feedbackContainer = document.getElementById('feedback-container');
    feedbackContainer.innerHTML = '';

    const filteredFeedbacks = filterFeedbacks();
    const start = (page - 1) * feedbacksPerPage;
    const end = start + feedbacksPerPage;
    const paginatedFeedbacks = filteredFeedbacks.slice(start, end);

    paginatedFeedbacks.forEach(feedback => {
        const feedbackElement = document.createElement('div');
        feedbackElement.classList.add('feedback-item');
        
        const userProfile = document.createElement('div');
        userProfile.classList.add('user-profile');
        const userImage = document.createElement('img');
        userImage.src = feedback.profile_picture || '../img/defaultprofile.jpg';
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

    const filteredFeedbacks = filterFeedbacks();
    const totalPages = Math.ceil(filteredFeedbacks.length / feedbacksPerPage);
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
    fetch('../php/insert_rosalie.php')
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

function calculateAverageRating() {
    if (feedbacks.length === 0) return 0;
    const totalRatings = feedbacks.reduce((acc, feedback) => acc + parseInt(feedback.star_rating), 0);
    const averageRating = totalRatings / feedbacks.length;
    return averageRating.toFixed(1);
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

    const averageRatingText = document.createElement('span');
    averageRatingText.classList.add('average-rating-text');
    averageRatingText.textContent = `(${averageRating} out of 5 stars)`;
    ratingElement.appendChild(averageRatingText);

    displayRatingPercentages();
}

document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', function() {
        currentFilter = this.id === 'filter-all' ? 'all' : this.id.split('-')[1];
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        displayFeedback(currentPage);
    });
});

function displayRatingPercentages() {
    const totalFeedbacks = feedbacks.length;
    const starCounts = [0, 0, 0, 0, 0];

    feedbacks.forEach(feedback => {
        starCounts[feedback.star_rating - 1]++;
    });

    const percentages = starCounts.map(count => ((count / totalFeedbacks) * 100).toFixed(1));

    const percentagesContainer = document.querySelector('.percentages');
    percentagesContainer.innerHTML = '';

    percentages.forEach((percentage, index) => {
        const percentageElement = document.createElement('div');
        percentageElement.classList.add('percentage-item');
        
        const starLabel = document.createElement('span');
        starLabel.classList.add('star-label');
        starLabel.innerText = `${5 - index} star: `;

        const percentageText = document.createElement('span');
        percentageText.classList.add('percentage-text');
        percentageText.innerText = `${percentage}%`;

        percentageElement.appendChild(starLabel);
        percentageElement.appendChild(percentageText);
        percentagesContainer.appendChild(percentageElement);
    });
}
function displayFeedback(page) {
    const feedbackContainer = document.getElementById('feedback-container');
    feedbackContainer.innerHTML = '';

    const filteredFeedbacks = filterFeedbacks();
    const start = (page - 1) * feedbacksPerPage;
    const end = start + feedbacksPerPage;
    const paginatedFeedbacks = filteredFeedbacks.slice(start, end);

    paginatedFeedbacks.forEach(feedback => {
        const feedbackElement = document.createElement('div');
        feedbackElement.classList.add('feedback-item');
        
        const userProfile = document.createElement('div');
        userProfile.classList.add('user-profile');
        const userImage = document.createElement('img');
        userImage.src = feedback.profile_picture || '../img/defaultprofile.jpg';
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

        const feedbackTextElement = document.createElement('div');
        feedbackTextElement.classList.add('feedback-text');
        const truncatedText = feedback.comment.length > 100 ? feedback.comment.substring(0, 100) + '...' : feedback.comment;
        feedbackTextElement.innerHTML = `
            <span class="truncated-text">${truncatedText}</span>
            <span class="full-feedback" style="display: none;">${feedback.comment}</span>
            ${feedback.comment.length > 100 ? '<span class="see-more">See More</span>' : ''}
        `;

        feedbackTextElement.querySelector('.see-more')?.addEventListener('click', function() {
            const fullFeedback = feedbackTextElement.querySelector('.full-feedback');
            const truncatedText = feedbackTextElement.querySelector('.truncated-text');
            if (fullFeedback.style.display === 'none') {
                fullFeedback.style.display = 'inline';
                truncatedText.style.display = 'none';
                this.textContent = 'See Less';
            } else {
                fullFeedback.style.display = 'none';
                truncatedText.style.display = 'inline';
                this.textContent = 'See More';
            }
        });

        feedbackElement.appendChild(userProfile);
        feedbackElement.appendChild(starRating);
        feedbackElement.appendChild(feedbackTextElement);

        feedbackContainer.appendChild(feedbackElement);
    });

    displayPagination(filteredFeedbacks.length, page);
}

initializePage();
