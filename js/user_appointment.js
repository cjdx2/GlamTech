// DATE
document.addEventListener("DOMContentLoaded", function() {
  let today = new Date().toISOString().split('T')[0];
  document.getElementById("date").setAttribute("min", today);
});

// DISABLED SERVICES
document.addEventListener('DOMContentLoaded', () => {
  const serviceOptions = document.querySelectorAll('.servicesoption');
  serviceOptions.forEach(option => {
      option.disabled = true;
  });
});

// CONTACT NUMBER
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

      // Update the hidden input field with the selected service value
      document.getElementById('service').value = option.getAttribute('data-value');
  });
});

// VALIDATE FORMa
function validateForm() {
  if (document.getElementById('service').value === '') {
      alert('Please fill out all fields');
      return false;
  }
  return true;
}

// Ensure the form is validated before submission
document.getElementById('appointment').addEventListener('submit', function(event) {
  if (!validateForm()) {
      event.preventDefault();
  }
});

// TIME VALIDATION - Ensuring proper time input
document.getElementById('appointmentTime').addEventListener('input', function() {
  const timeValue = this.value;
  const [hour, minute] = timeValue.split(':').map(Number);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      alert("Please enter a valid time.");
      this.value = '';
  }
});

