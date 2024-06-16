document.addEventListener("DOMContentLoaded", function() {
    const logoutLink = document.getElementById("logout-btn");
    const menuButton = document.getElementById("menu-button");
    const subMenu = document.getElementById("sub-menu");
    const servicesLink = document.querySelector('a[href="#services"]');
    const staffLink = document.querySelector('a[href="#staff"]');
    const galleryLink = document.querySelector('a[href="#gallery"]');
    const aboutLink = document.querySelector('a[href="#about"]');
    
    // Event listener for logout link
    logoutLink.addEventListener("click", function(event) {
        event.preventDefault();
        // Assuming you want to clear the session and redirect to the login page
        localStorage.clear();
        window.location.href = "../html/login1.html";
    });

    // Event listener for menu button
    menuButton.addEventListener("click", function() {
        subMenu.style.display = subMenu.style.display === "block" ? "none" : "block";
    });
});
