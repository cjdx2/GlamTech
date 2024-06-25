let feedbacks = [];
let currentPage = 1;
const feedbacksPerPage = 5;

document.querySelector('.submit-button button').addEventListener('click', function(event) {
    event.preventDefault();
    
    // Get the rating value
    const rating = document.querySelector('input[name="rating"]:checked');
    const feedbackText = document.getElementById('feedback').value;
    
    if (rating && feedbackText) {
        // Get the current date and time
        const now = new Date();
        const dateTimeString = now.toLocaleString();

        // Create a feedback object
        const feedback = {
            rating: rating.value,
            text: feedbackText,
            dateTime: dateTimeString
        };

        // Add the feedback to the array
        feedbacks.push(feedback);
        
        // Clear the form
        document.getElementById('feedback').value = '';
        document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);

        // Display the current page of feedback
        displayFeedback(currentPage);
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
        
        // Add user profile picture
        const userProfile = document.createElement('div');
        userProfile.classList.add('user-profile');
        const userImage = document.createElement('img');
        userImage.src = '../img/profile 4.png';
        userImage.alt = 'User Profile';
        userProfile.appendChild(userImage);
        
        // Add rating stars
        const starRating = document.createElement('div');
        starRating.classList.add('star-rating');
        for (let i = 4; i >= 0; i--) {
            const star = document.createElement('span');
            star.classList.add('star');
            star.innerHTML = i < feedback.rating ? '&#9733;' : '&#9734';
            starRating.appendChild(star);
        }

        // Add feedback text
        const feedbackTextElement = document.createElement('p');
        feedbackTextElement.classList.add('feedback-text');
        feedbackTextElement.innerText = feedback.text;

        // Add date and time
        const dateTimeElement = document.createElement('p');
        dateTimeElement.classList.add('date-time');
        dateTimeElement.innerText = feedback.dateTime;
        
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

// Initialize the first page of feedback
displayFeedback(currentPage);


// Calculate the average rating
function calculateAverageRating() {
    const totalRatings = feedbacks.reduce((acc, feedback) => acc + parseInt(feedback.rating), 0);
    const averageRating = totalRatings / feedbacks.length;
    return averageRating;
  }
  
// Display the average rating as a percentage
function displayAverageRating() {
    const averageRating = calculateAverageRating();
    const percentage = (averageRating / 5) * 100;
    const ratingElement = document.querySelector('.rating');
    ratingElement.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.classList.add('star');
      if (i <= averageRating) {
        star.innerHTML = '&#9733;';
      } else {
        star.innerHTML = '&#9734;';
      }
      ratingElement.appendChild(star);
    }
    const percentageElement = document.createElement('span');
    percentageElement.classList.add('percentage-text'); // add a class to the span element
    // percentageElement.innerHTML = ` (${percentage.toFixed(2)}%)`; // to display the number percentage beside the star rating
    // ratingElement.appendChild(percentageElement);
  }
  
  // Call the displayAverageRating function whenever the feedbacks array changes
  document.querySelector('.submit-button button').addEventListener('click', function(event) {
    //...
    displayAverageRating();
  });
  
  // Initialize the average rating display
  displayAverageRating();