// DATE - Set minimum date to today
document.addEventListener("DOMContentLoaded", function() {
  let today = new Date().toISOString().split('T')[0];
  document.getElementById("date").setAttribute("min", today);
});

// DISABLED SERVICES - Disable all service options initially
document.addEventListener('DOMContentLoaded', () => {
  const serviceOptions = document.querySelectorAll('.servicesoption');
  serviceOptions.forEach(option => {
    option.disabled = true;
  });
});

// CONTACT NUMBER - Set default value and validate input
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

// DROPDOWN SERVICES - Toggle dropdown options visibility
document.getElementById('dropdown-header').addEventListener('click', function() {
  const options = document.getElementById('dropdown-options');
  options.classList.toggle('show');
});

// VALIDATE FORM - Ensure a service is selected before submission
function validateForm() {
  const selectedServices = Array.from(document.querySelectorAll('#dropdown-options input[type="checkbox"]:checked'))
                            .map(checkbox => checkbox.value);
  
  if (selectedServices.length === 0) {
    alert('Please select at least one service');
    return false;
  }
  
  // Update the hidden input field with the selected services
  document.getElementById('service').value = selectedServices.join(',');

  return true;
}

// DISPLAY STAFF - Fetch and display staff information based on selected services
function displayStaff(selectedServices) {
  const staffSection = document.getElementById('staff-recommendation');

  // Reset staff section
  staffSection.innerHTML = '';

  console.log('Selected services:', selectedServices); // Debug log

  // Make POST request to Flask backend
  fetch('http://127.0.0.1:5000/recommend-staff', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ services: selectedServices })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Recommendations received:', data); // Debug log

    if (data.recommendations && data.recommendations.length > 0) {
      data.recommendations.forEach(recommendedStaff => {
        const staffName = recommendedStaff;
        const staffServices = selectedServices.join(', ');

        // Construct HTML for staff member
        const staffHTML = `
          <div class="staff-member">
            <img src="/img/${staffName.toLowerCase()}.png" alt="${staffName}">
            <p>${staffName}</p>
            <p>${getStaffExpertise(staffName)}</p>
            <p>Services: ${staffServices}</p>
          </div>
        `;

        // Append staff HTML to staff section
        staffSection.innerHTML += staffHTML;
      });
    } else {
      staffSection.innerHTML += '<p>No staff available for these services.</p>';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    staffSection.innerHTML += '<p>Failed to fetch staff recommendations.</p>';
  });
}

// HANDLE SERVICE SELECTION - Event listener for service checkboxes
const serviceCheckboxes = document.querySelectorAll('#dropdown-options input[type="checkbox"]');

serviceCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    const selectedServices = Array.from(serviceCheckboxes)
                                .filter(checkbox => checkbox.checked)
                                .map(checkbox => checkbox.value);

    displayStaff(selectedServices);
  });
});

// Get expertise details for a staff member based on their name
function getStaffExpertise(staffName) {
  const expertiseMap = {
    'Wendell': 'Haircut, Shampoo with Blow Dry, Hair Iron, Hair Color, Highlights, Hot Oil, Hair Mask, Hair Spa, Semi D Lino, Cellophane, Cold Wave',
    'Jirven': 'Haircut, Shampoo with Blow Dry, Hair Iron, Hair Color, Highlights, Hot Oil, Hair Mask, Hair Spa, Semi D Lino, Cellophane, Cold Wave',
    'Joane': 'Haircut, Shampoo with Blow Dry, Hair Iron, Hair Color, Highlights, Hot Oil, Hair Mask, Hair Spa, Semi D Lino, Cellophane, Cold Wave',
    'Rosalie': 'Manicure, Pedicure, Gel Polish Manicure, Gel Polish, Foot Spa, Premium Foot Spa',
    'Mernalyn': 'Manicure, Pedicure, Gel Polish Manicure, Gel Polish, Foot Spa, Premium Foot Spa'
  };
  return expertiseMap[staffName] || 'Unknown Expertise';
}
