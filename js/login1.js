document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginBox = document.getElementById('login-box');
    const signupBox = document.getElementById('signup-box');
    const errorMessage = document.createElement('p');
    const successMessage = document.createElement('p');

    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none';
    errorMessage.id = 'error-message';
    loginBox.appendChild(errorMessage);

    successMessage.style.color = 'green';
    successMessage.style.display = 'none';
    successMessage.id = 'success-message';
    signupBox.appendChild(successMessage);

    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.style.display = 'none';
        signupBox.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupBox.style.display = 'none';
        loginBox.style.display = 'block';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const adminUsername = 'glamtech';
        const adminPassword = '123';

        if (username === adminUsername && password === adminPassword) {
            window.location.href = 'adminhome.html';
        } else {
            window.location.href = 'homepage.html';
        }
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstname = document.getElementById('signup-firstname').value;
        const lastname = document.getElementById('signup-lastname').value;
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const email = document.getElementById('signup-email').value;
        const phone = document.getElementById('signup-phone').value;

        handleSignup({
            firstname,
            lastname,
            username,
            password,
            email,
            phone
        });
    });

    function handleSignup(userDetails) {
        console.log(userDetails);

        displaySuccessMessage('Account successfully created!');

        window.location.href = 'homepage.html';
    }

    function displaySuccessMessage(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
    }
});
