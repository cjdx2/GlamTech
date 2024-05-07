document.addEventListener("DOMContentLoaded", function() {
    const loginContainer = document.getElementById("login-container");
    const signupContainer = document.getElementById("signup-container");
    const homeContainer = document.getElementById("home-container");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const signupLink = document.getElementById("signup-link");
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-btn");
    const menuButton = document.getElementById("menu-button");
    const subMenu = document.getElementById("sub-menu");

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
        showHomePage();
    }

    // Event listener for login form submission
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // For simplicity, just checking if username and password are not empty
        if (username && password) {
            // Assuming authentication is successful, set isLoggedIn to true
            localStorage.setItem("isLoggedIn", true);
            showHomePage();
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
            showHomePage();
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

    // Event listener for logout link
    logoutLink.addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.removeItem("isLoggedIn");
        showLoginPage();
    });

    // Event listener for menu button
    menuButton.addEventListener("click", function() {
        subMenu.style.display = subMenu.style.display === "block" ? "none" : "block";
    });

    // Function to show home page
    function showHomePage() {
        loginContainer.style.display = "none";
        signupContainer.style.display = "none";
        homeContainer.style.display = "block";
    }

    // Function to show login page
    function showLoginPage() {
        loginContainer.style.display = "block";
        signupContainer.style.display = "none";
        homeContainer.style.display = "none";
    }

    // Function to show sign up page
    function showSignupPage() {
        loginContainer.style.display = "none";
        signupContainer.style.display = "block";
        homeContainer.style.display = "none";
    }
});
