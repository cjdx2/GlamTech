document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginBox = document.getElementById('login-box');
    const signupBox = document.getElementById('signup-box');
    const errorMessage = document.createElement('p');

    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none';
    errorMessage.id = 'error-message';
    loginBox.appendChild(errorMessage);

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

        // Hard-coded credentials for admin
        const adminUsername = 'admin';
        const adminPassword = 'password123';

        if (username === adminUsername && password === adminPassword) {
            // Redirect to admin page
            window.location.href = 'adminhome.html';
        } else {
            // Show error message
            errorMessage.textContent = 'Invalid username or password';
            errorMessage.style.display = 'block';
        }
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        // Handle signup logic here
        window.location.href = 'homepage.html';
    });
});
