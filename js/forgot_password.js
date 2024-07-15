

document.addEventListener("DOMContentLoaded", () => {
    
    
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const new_password = document.getElementById('new-password').value;
        const confirm_password = document.getElementById('confirm-password').value;
       

        handleSignup({
            new_password, confirm_password
        });
    });

    function handleSignup(userDetails) {
        console.log(userDetails);

        displaySuccessMessage('Account successfully created!');

        window.location.href = 'login.html';
    }

    function displaySuccessMessage(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
    }
});

// password restriction
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const passwordInput = document.getElementById('signup-password');

    signupForm.addEventListener('submit', (e) => {
        const password = passwordInput.value;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;

        if (!passwordPattern.test(password)) {
            e.preventDefault();
            alert('Password must be at least 8 characters long and include at least 1 special character, 1 capital letter, 1 small letter, and 1 number.');
        }
    });
});