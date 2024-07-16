document.addEventListener("DOMContentLoaded", function() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("date").setAttribute("min", today);

    // Disable all service options initially
    const serviceOptions = document.querySelectorAll('.servicesoption');
    serviceOptions.forEach(option => option.disabled = true);

    // Set default value and validate input for contact number
    const contactInput = document.getElementById('usercontact');

    contactInput.addEventListener('focus', () => {
        if (contactInput.value === '') {
            contactInput.value = '09';
        }
    });

    contactInput.addEventListener('input', (e) => {
        let inputValue = e.target.value;
        const lastChar = inputValue[inputValue.length - 1];

        if (!/\d/.test(lastChar)) {
            e.preventDefault();
            e.target.value = inputValue.replace(/[^0-9]/g, '');
        }

        if (inputValue.length === 2 && inputValue !== '09') {
            e.preventDefault();
            e.target.value = '09';
        }
    });

    // Toggle dropdown options visibility
    document.getElementById('dropdown-header').addEventListener('click', function() {
        const options = document.getElementById('dropdown-options');
        options.classList.toggle('show');
    });

    // Ensure a service is selected before form submission
    document.getElementById('appointment').addEventListener('submit', validateForm);

    // Handle service selection and display staff recommendations
    const serviceCheckboxes = document.querySelectorAll('#dropdown-options input[type="checkbox"]');
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const selectedServices = Array.from(serviceCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value);

            displayStaff(selectedServices);
            updateHiddenServiceInput(selectedServices);
        });
    });
});

function validateForm(event) {
    const firstname = document.getElementById('firstname').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const usercontact = document.getElementById('usercontact').value.trim();
    const date = document.getElementById('date').value.trim();
    const time = document.getElementById('time').value.trim();
    const services = document.querySelectorAll('input[name="services[]"]:checked');

    if (!firstname || !lastname || !email || !usercontact || !date || !time || services.length === 0) {
        alert('Please fill out all fields and select at least one service.');
        event.preventDefault();
        return false;
    }

    document.getElementById('service').value = Array.from(services).map(checkbox => checkbox.value).join(',');
    return true;
}

function displayStaff(selectedServices) {
    const staffSection = document.getElementById('staff-recommendation');
    staffSection.innerHTML = '';

    fetch('http://127.0.0.1:5000/recommend-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: selectedServices })
    })
    .then(response => response.json())
    .then(data => {
        if (data.recommendations && data.recommendations.length > 0) {
            // Calculate overall average ratings for each staff member
            const staffRatings = {};
            data.recommendations.forEach(recommendedStaff => {
                const { name, star_rating } = recommendedStaff;
                if (!staffRatings[name]) {
                    staffRatings[name] = {
                        totalStars: star_rating,
                        count: 1
                    };
                } else {
                    staffRatings[name].totalStars += star_rating;
                    staffRatings[name].count++;
                }
            });

            // Calculate overall average ratings
            const staffWithAverageRating = Object.keys(staffRatings).map(name => {
                const averageRating = staffRatings[name].totalStars / staffRatings[name].count;
                return { name, averageRating };
            });

            // Sort staff by overall average rating in descending order
            staffWithAverageRating.sort((a, b) => b.averageRating - a.averageRating);

            // Display staff with highest ratings
            staffWithAverageRating.forEach(staff => {
                const staffName = staff.name.toLowerCase();
                const staffHTML = `
                    <div class="staff-member">
                        <img src="../img/${staffName}.png" alt="${staffName}">
                        <div class="staff-info">
                            <p><strong>${staffName}</strong></p>
                            <div class="star-rating" id="star-rating-${staffName}"></div>
                        </div>
                        <div class="staff-reviews" id="reviews-${staffName}">
                            <!-- Reviews will be loaded here -->
                        </div>
                    </div>
                `;
                staffSection.innerHTML += staffHTML;
                renderStarRating(`star-rating-${staffName}`, staff.averageRating);
                fetchReviews(staffName); // Fetch and display top 3 feedbacks
            });

            // Update hidden input field with recommended staff
            const recommendedStaff = staffWithAverageRating.map(staff => staff.name).join(', ');
            document.getElementById('recommended_staff').value = recommendedStaff;

        } else {
            staffSection.innerHTML += '<p>No staff available for these services.</p>';
        }
    })
    .catch(error => console.error('Error fetching staff recommendations:', error));
}

function renderStarRating(containerId, rating) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content

    const starsTotal = 5;
    const starPercentage = (rating / starsTotal) * 100;
    const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;

    const starContainer = document.createElement('div');
    starContainer.classList.add('stars-inner');
    starContainer.style.width = starPercentageRounded;

    const starEmpty = document.createElement('div');
    starEmpty.classList.add('stars-outer');
    starEmpty.appendChild(starContainer);

    for (let i = 0; i < starsTotal; i++) {
        const starIcon = document.createElement('i');
        starIcon.classList.add('fas', 'fa-star');
        starEmpty.appendChild(starIcon);
    }

    container.appendChild(starEmpty);
}

function fetchReviews(staffName) {
    fetch(`/GlamTech/php/get_feedback_${staffName}.php`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Sort feedback by star_rating in descending order
            data.sort((a, b) => b.star_rating - a.star_rating);

            // Take only the top 3 highest rated feedback entries
            const topThreeFeedback = data.slice(0, 3);

            // Select the container where reviews will be displayed
            const reviewsContainer = document.querySelector(`#reviews-${staffName}`);
            reviewsContainer.innerHTML = ''; // Clear previous content

            // Iterate over the top three feedback entries
            topThreeFeedback.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review';
                reviewElement.innerHTML = `
                    <img src="${review.profile_picture}" alt="User Profile Picture">
                    <div class="review-details">
                        <span class="review-rating">${review.star_rating}</span>
                        <p class="review-comment">${review.comment}</p>
                        <span class="review-date">${review.date_time}</span>
                    </div>
                `;
                reviewsContainer.appendChild(reviewElement);
            });
        })
        .catch(error => console.error('Error fetching reviews:', error));
}

function updateHiddenServiceInput(selectedServices) {
    document.getElementById('service').value = selectedServices.join(',');
}
