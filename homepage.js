document.addEventListener("DOMContentLoaded", function() {
    const homeContainer = document.getElementById("home-container");
    const logoutLink = document.getElementById("logout-btn");
    const menuButton = document.getElementById("menu-button");
    const subMenu = document.getElementById("sub-menu");

    // Event listener for logout link
    logoutLink.addEventListener("click", function(event) {
        event.preventDefault();
        // Assuming you want to clear the session and redirect to the login page
        localStorage.clear();
        window.location.href = "login.html";
    });

    // Event listener for menu button
    menuButton.addEventListener("click", function() {
        subMenu.style.display = subMenu.style.display === "block" ? "none" : "block";
    });
});
