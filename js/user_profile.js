document.addEventListener('DOMContentLoaded', function() {
    fetch('../php/get_user_profile.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('first-name').value = data.firstname;
            document.getElementById('last-name').value = data.lastname;
            document.getElementById('username').value = data.username;
            document.getElementById('password').value = data.password;
            document.getElementById('email').value = data.email;
            document.getElementById('phone-number').value = data.phone;
            document.getElementById('profile-picture-preview').src = data.profile_picture || '../img/defaultprofile.jpg';
        })
        .catch(error => console.error('Error:', error));

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

    document.getElementById('profile-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);

        fetch('../php/update_profile.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Information updated successfully.');
            } else {
                console.error('Error message:', data.message);
                showNotification('Error updating information.', true);
            }
        })
        .catch(error => console.error('Error:', error));
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
});
