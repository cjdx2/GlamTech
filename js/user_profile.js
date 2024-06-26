// Form handling
document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const emailInput = document.getElementById('email');
    const phoneNumberInput = document.getElementById('phone-number');

    if (firstNameInput.value) {
        firstNameInput.placeholder = firstNameInput.value;
    }
    if (lastNameInput.value) {
        lastNameInput.placeholder = lastNameInput.value;
    }
    if (emailInput.value) {
        emailInput.placeholder = emailInput.value;
    }
    if (phoneNumberInput.value) {
        phoneNumberInput.placeholder = phoneNumberInput.value;
    }

    firstNameInput.value = '';
    lastNameInput.value = '';
    emailInput.value = '';
    phoneNumberInput.value = '';

    showNotification('Information updated successfully.');
});

function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    if (isError) {
        notification.classList.add('error');
    }
    notification.innerText = message;

    document.body.appendChild(notification);
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
        document.body.removeChild(notification);
    }, 3000);
}

const backButton = document.querySelector('.back-button');
backButton.addEventListener('click', function(event) {
    if (isFormEdited()) {
        const confirmLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
        if (!confirmLeave) {
            event.preventDefault();
            return;
        }
    }
    window.location.href = 'homepage.html';
});

function isFormEdited() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phone-number').value;

    return firstName || lastName || email || phoneNumber;
}

// Profile picture handling
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
