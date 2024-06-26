
// DATE
document.addEventListener("DOMContentLoaded", function() {
    // Get the current date in YYYY-MM-DD format
    let today = new Date().toISOString().split('T')[0];

    // Set the min attribute for the date input to the current date
    document.getElementById("date").setAttribute("min", today);
});
//DISABLED SERVICES
document.addEventListener('DOMContentLoaded', (event) => {
    const serviceOptions = document.querySelectorAll('option.servicesoption');
    serviceOptions.forEach(option => {
        option.disabled = true;
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const serviceOptions = document.querySelectorAll('option.service');
    serviceOptions.forEach(option => {
        option.disabled = true;
    });
});

//optionservices-none
document.addEventListener('DOMContentLoaded', (event) => {
    const serviceOptions = document.querySelectorAll('option.options');
    serviceOptions.forEach(option => {
        option.style.display = 'none';
    });
});



//TIME
function validateForm() {
    const hourInput = document.querySelector('input[name="appointmentHour"]');
    const minuteInput = document.querySelector('input[name="appointmentMinute"]');

    if (hourInput.value < 1 || hourInput.value > 12) {
        alert("Please enter a valid hour between 1 and 12.");
        return false;
    }

    if (minuteInput.value < 0 || minuteInput.value > 59) {
        alert("Please enter a valid minute between 00 and 59.");
        return false;
    }

    return true;
}

document.querySelector('input[name="appointmentHour"]').addEventListener('input', function () {
    if (this.value < 1) this.value = 1;
    if (this.value > 12) this.value = 12;
});

document.querySelector('input[name="appointmentMinute"]').addEventListener('input', function () {
    if (this.value < 0) this.value = 0;
    if (this.value > 59) this.value = 59;
});

document.querySelector('input[name="appointmentHour"]').addEventListener('keydown', function (e) {
    if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
});

document.querySelector('input[name="appointmentMinute"]').addEventListener('keydown', function (e) {
    if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
});

// DROPDOWN SERVICES 

document.getElementById('dropdown-header').addEventListener('click', function() {
    const options = document.getElementById('dropdown-options');
    if (options.style.display === 'none' || options.style.display === '') {
        options.style.display = 'block';
    } else {
        options.style.display = 'none';
    }
});


document.querySelectorAll('.services').forEach(function(option) {
    option.addEventListener('click', function() {
        const selectedService = document.getElementById('selected-service');
        const serviceName = option.innerText.split('₱')[0].trim();
        const servicePrice = option.querySelector('.price').textContent.replace('₱', '');
        selectedService.innerHTML = `
            <span>${serviceName}</span>
            <span style="float:right;">₱${servicePrice}</span>
        `;
        document.getElementById('dropdown-options').style.display = 'none';
    });
});

//END
/*
document.addEventListener("DOMContentLoaded", function() {
    const services = document.querySelectorAll(".services");
    const ratingsSection = document.getElementById("ratings");

    services.forEach((service) => {
        service.addEventListener("click", function() {
            ratingsSection.style.display = "block";
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const services = document.querySelectorAll(".services");
    const reviewsSection = document.getElementById("reviews");

    services.forEach((service) => {
        service.addEventListener("click", function() {
           reviewsSection.style.display = "block";
        });
    });
});
 */

document.addEventListener("DOMContentLoaded", function() {
    const services = document.querySelectorAll(".services");
    const ratingsSection = document.getElementById("ratings");
    const reviewsSection = document.getElementById("reviews");
    let currentRatingsSection;
    let currentReviewsSection;

    services.forEach((service) => {
        service.addEventListener("click", function() {
            const serviceName = service.getAttribute("value");
            const ratingsContainer = document.getElementById(`${serviceName}-ratings`);
            const reviewsContainer = document.getElementById(`${serviceName}-reviews`);

            // Hide previously shown ratings and reviews sections
            if (currentRatingsSection) {
                currentRatingsSection.style.display = "none";
            }
            if (currentReviewsSection) {
                currentReviewsSection.style.display = "none";
            }

            // Show the new ratings and reviews sections
            ratingsSection.style.display = "block";
            reviewsSection.style.display = "block";
            ratingsContainer.style.display = "block";
            reviewsContainer.style.display = "block";

            // Update the current sections
            currentRatingsSection = ratingsContainer;
            currentReviewsSection = reviewsContainer;
        });
    });
});


//required field

//WIILLL CHANGE
function checkServiceSelected() {
  const selectedService = document.querySelector('#selected-service');
  const selectedValue = selectedService.getAttribute('data-selected-service');

  if (!selectedValue) {
    alert('Please select a service before proceeding.');
    return false;
  }

  return true;
}
