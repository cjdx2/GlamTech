document.querySelector('.submit-button button').addEventListener('click', function(event) {
    event.preventDefault();
    
    // Get the rating value
    const rating = document.querySelector('input[name="rating"]:checked');
    const feedbackText = document.getElementById('feedback').value;
    const feedbackContainer = document.getElementById('feedback-container');
    
    if (rating && feedbackText) {
      // Create a new feedback element
      const feedbackElement = document.createElement('div');
      feedbackElement.classList.add('feedback-item');
      
      // Add user profile picture
      const userProfile = document.createElement('div');
      userProfile.classList.add('user-profile');
      const userImage = document.createElement('img');
      userImage.src = '../img/profile 2.png';
      userImage.alt = 'User Profile';
      userProfile.appendChild(userImage);
      
      // Add rating stars
      const starRating = document.createElement('div');
      starRating.classList.add('star-rating');
      for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        star.innerHTML = i < rating.value ? '&#9733;' : '&#9734;';
        starRating.appendChild(star);
      }
      
      // Add feedback text
      const feedbackTextElement = document.createElement('p');
      feedbackTextElement.classList.add('feedback-text');
      feedbackTextElement.innerText = feedbackText;
      
      feedbackElement.appendChild(userProfile);
      feedbackElement.appendChild(starRating);
      feedbackElement.appendChild(feedbackTextElement);
      
      // Append to feedback container
      feedbackContainer.appendChild(feedbackElement);
      
      // Clear the form
      document.getElementById('feedback').value = '';
      document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);
    } else {
      alert('Please provide a rating and feedback.');
    }
  });
