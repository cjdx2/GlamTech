document.addEventListener("DOMContentLoaded", function() {
    const loginContainer = document.getElementById("login-container");
    const signupContainer = document.getElementById("signup-container");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const signupLink = document.getElementById("signup-link");
    const loginLink = document.getElementById("login-link");

    // Event listener for login form submission
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // For simplicity, just checking if username and password are not empty
        if (username && password) {
            // Assuming authentication is successful, redirect to the home page
            window.location.href = "homepage.html";
        } else {
            alert("Please enter username and password");
        }
    });

    // Event listener for sign up form submission
    signupForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const username = document.getElementById("signup-username").value;
        const password = document.getElementById("signup-password").value;

        // For simplicity, just checking if username and password are not empty
        if (username && password) {
            // Perform sign up functionality here
            alert("Sign up functionality not implemented in this example");
            // After successful sign up, you can redirect the user to the home page
            window.location.href = "homepage.html";
        } else {
            alert("Please enter username and password");
        }
    });

    // Event listener for sign up link
    signupLink.addEventListener("click", function(event) {
        event.preventDefault();
        showSignupPage();
    });

    // Event listener for login link
    loginLink.addEventListener("click", function(event) {
        event.preventDefault();
        showLoginPage();
    });

    // Function to show login page
    function showLoginPage() {
        loginContainer.style.display = "block";
        signupContainer.style.display = "none";
    }

    // Function to show sign up page
    function showSignupPage() {
        loginContainer.style.display = "none";
        signupContainer.style.display = "block";
    }
});
