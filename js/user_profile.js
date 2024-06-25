document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const emailInput = document.getElementById('email');
    const phoneNumberInput = document.getElementById('phone-number');

    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;
    const phoneNumber = phoneNumberInput.value;

    firstNameInput.placeholder = firstName;
    lastNameInput.placeholder = lastName;
    emailInput.placeholder = email;
    phoneNumberInput.placeholder = phoneNumber;

    firstNameInput.value = '';
    lastNameInput.value = '';
    emailInput.value = '';
    phoneNumberInput.value = '';
});

document.getElementById('profile-picture-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-picture-preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

//menu

const menuButton = document.getElementById('menu-button');
const subMenu = document.getElementById('sub-menu');

menuButton.addEventListener('click', function() {
    subMenu.classList.toggle('visible');
});

document.addEventListener('click', function(event) {
    if (!menuButton.contains(event.target) && !subMenu.contains(event.target)) {
        subMenu.classList.remove('visible');
    }
});

const submenuItems = subMenu.querySelectorAll('ul li a');

submenuItems.forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();

        const targetSection = item.getAttribute('href');

        subMenu.classList.remove('visible');

        const targetElement = document.querySelector(targetSection);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});