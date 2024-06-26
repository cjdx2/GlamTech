
// DATE
document.addEventListener("DOMContentLoaded", function() {
    
    let today = new Date().toISOString().split('T')[0];

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

//CONTACT NUMBER



  const contactInput = document.getElementById('usercontact');

  contactInput.addEventListener('focus', () => {
    if (contactInput.value === '') {
      contactInput.value = '09';
    }
  });

  contactInput.addEventListener('input', (e) => {
    const inputValue = e.target.value;
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

//TIME

const hourInput = document.querySelector('input[name="appointmentHour"]');
const minuteInput = document.querySelector('input[name="appointmentMinute"]');

hourInput.addEventListener('keydown', (e) => {
  const keyValue = e.key;
  if (!/^\d$/.test(keyValue) && keyValue !== 'Backspace' && keyValue !== 'Delete') {
    e.preventDefault();
  }
});

minuteInput.addEventListener('keydown', (e) => {
  const keyValue = e.key;
  if (!/^\d$/.test(keyValue) && keyValue !== 'Backspace' && keyValue !== 'Delete') {
    e.preventDefault();
  }
  const currentValue = minuteInput.value;
  if (currentValue.length >= 2 && keyValue !== 'Backspace' && keyValue !== 'Delete') {
    e.preventDefault();
  }
  const currentValueAsNumber = parseInt(currentValue, 10);
  if (currentValueAsNumber >= 60) {
    e.preventDefault();
  }
});

hourInput.addEventListener('input', (e) => {
  const currentValue = hourInput.value;
  const currentValueAsNumber = parseInt(currentValue, 10);
  if (currentValueAsNumber > 12) {
    hourInput.value = '12';
  }
});

minuteInput.addEventListener('input', (e) => {
  const currentValue = minuteInput.value;
  const currentValueAsNumber = parseInt(currentValue, 10);
  if (currentValueAsNumber > 59) {
    minuteInput.value = '59';
  }
});



minuteInput.addEventListener('blur', (e) => {
  const value = e.target.value;
  if (value < 10) {
    e.target.value = `0${value}`;
  }
});



//END TIME

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
// SHOW RATINGS
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

document.querySelectorAll('.services').forEach((service) => {
    service.addEventListener('click', (e) => {
        // Update the value of the hidden input field
        document.getElementById('service').value = e.target.getAttribute('data-value');
    });
});

function validateForm() {
    if (document.getElementById('service').value === '') {
        alert('Please fill out all fields');
        return false;
    }
    return true;
}