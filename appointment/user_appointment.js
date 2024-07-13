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
  document.getElementById('appointment-form').addEventListener('submit', validateForm);

  // Handle service selection and display staff recommendations
  const serviceCheckboxes = document.querySelectorAll('#dropdown-options input[type="checkbox"]');
  serviceCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
          const selectedServices = Array.from(serviceCheckboxes)
              .filter(checkbox => checkbox.checked)
              .map(checkbox => checkbox.value);

          displayStaff(selectedServices);
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
          const uniqueStaff = new Set();
          data.recommendations.forEach(recommendedStaff => {
              const { name, expertise } = recommendedStaff;
              if (!uniqueStaff.has(name)) {
                  uniqueStaff.add(name);
                  const staffHTML = `
                      <div class="staff-member">
                          <img src="../img/${name.toLowerCase()}.png" alt="${name}">
                          <div class="staff-info">
                              <p><strong>${name}</strong></p>
                              <p>${expertise}</p>
                          </div>
                      </div>
                  `;
                  staffSection.innerHTML += staffHTML;
              }
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

