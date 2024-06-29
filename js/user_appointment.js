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
          <span>${serviceName} &nbsp</span>
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

// Function to display staff based on selected service
function displayStaff(serviceValue) {
  const staffSection = document.getElementById('staff');

  // Reset staff section
  staffSection.innerHTML = '<h2>Our Staff</h2><div class="staff-grid"></div>';

  // Define staff mapping based on services and their corresponding staff
  const staffMapping = {
      'manicure': ['Rosalie', 'Mernalyn'],
      'pedicure': ['Rosalie', 'Mernalyn'],
      'gelpolishmanicure': ['Rosalie', 'Mernalyn'],
      'gelpolish': ['Rosalie', 'Mernalyn'],
      'footspa': ['Rosalie', 'Mernalyn'],
      'premiumfootspa': ['Rosalie', 'Mernalyn'],
      'haircut': ['Jirven'],
      'shampoowithblowdry': ['Joane', 'Wendel'],
      'hairiron': ['Joane', 'Wendel'],
      'haircolor': ['Joane'],
      'highlights': ['Joane'],
      'hotoil': ['Joane', 'Wendel'],
      'hairmask': ['Joane', 'Wendel'],
      'hairspa': ['Joane', 'Wendel'],
      'semidlino': ['Joane'],
      'cellophane': ['Joane', 'Wendel'],
      'coldwave': ['Joane', 'Wendel']
  };

  // Get staff members for selected service
  const qualifiedStaff = staffMapping[serviceValue];

  // Display the first qualified staff member (or only one if there's only one)
  if (qualifiedStaff && qualifiedStaff.length > 0) {
      const staffMember = qualifiedStaff[0]; // Displaying the first staff member

      // Construct HTML for staff member
      const staffHTML = `
          <div class="staff-member ${staffMember.toLowerCase().replace(' ', '')}">
              <a href="staff_profile.html">
                  <img src="../img/${staffMember.toLowerCase()}.png" alt="${staffMember}">
              </a>
              <p>${staffMember}</p>
              <p>${getStaffExpertise(staffMember)}</p>
          </div>
      `;

      // Append staff HTML to staff section
      const staffGrid = staffSection.querySelector('.staff-grid');
      staffGrid.innerHTML = staffHTML;
  } else {
      staffSection.innerHTML += '<p>No staff available for this service.</p>';
  }
}

// Helper function to get staff expertise based on their name
function getStaffExpertise(staffName) {
  const expertiseMap = {
      'Rosalie': 'Manicurist',
      'Mernalyn': 'Manicurist',
      'Joane': 'Hairdresser',
      'Wendel': 'Hairdresser',
      'Jirven': 'Haircut'
      // Add more if needed
  };

  return expertiseMap[staffName] || 'Unknown';
}

// Event listener for service selection
document.querySelectorAll('.services').forEach(function(option) {
  option.addEventListener('click', function() {
      const selectedService = option.getAttribute('data-value');
      const serviceName = option.innerText.split('₱')[0].trim();
      const servicePrice = option.querySelector('.price').textContent.replace('₱', '');

      // Update selected service display
      const selectedServiceDisplay = document.getElementById('selected-service');
      selectedServiceDisplay.innerHTML = `
          <span>${serviceName} &nbsp</span>
          <span style="float:right;">₱${servicePrice}</span>
      `;

      // Update the hidden input field with the selected service value
      document.getElementById('service').value = selectedService;

      // Display staff for selected service
      displayStaff(selectedService);
  });
});