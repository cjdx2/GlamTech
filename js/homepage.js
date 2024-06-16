document.addEventListener("DOMContentLoaded", function() {
    const logoutLink = document.getElementById("logout-btn");
    const menuButton = document.getElementById("menu-button");
    const subMenu = document.getElementById("sub-menu");
    const header = document.querySelector('header');
    const servicesLink = document.querySelector('a[href="#services"]');
    const staffLink = document.querySelector('a[href="#staff"]');
    const galleryLink = document.querySelector('a[href="#gallery"]');
    const aboutLink = document.querySelector('a[href="#about"]');
    
    logoutLink.addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.clear();
        window.location.href = "../html/login1.html";
    });

    // Event listener for menu button
    menuButton.addEventListener("click", function() {
        subMenu.style.display = subMenu.style.display === "block" ? "none" : "block";
    });

    // Event listeners for smooth scrolling
    servicesLink.addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("services").scrollIntoView({ behavior: "smooth" });
        subMenu.style.display = "none"; // Hide menu after click
    });

    staffLink.addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("staff").scrollIntoView({ behavior: "smooth" });
        subMenu.style.display = "none"; // Hide menu after click
    });

    galleryLink.addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
        subMenu.style.display = "none"; // Hide menu after click
    });

    aboutLink.addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("about").scrollIntoView({ behavior: "smooth" });
        subMenu.style.display = "none"; // Hide menu after click
    });
});
