document.addEventListener("DOMContentLoaded", function() {
    const logoutLink = document.getElementById("logout-btn");
    const menuButton = document.getElementById("menu-button");
    const subMenu = document.getElementById("sub-menu");
    const header = document.querySelector('header');
    const servicesLink = document.querySelector('a[href="#services"]');
    const staffLink = document.querySelector('a[href="#staff"]');
    const galleryLink = document.querySelector('a[href="#gallery"]');
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const aboutLink = document.querySelector('a[href="#about"]');
    const homeLink = document.querySelector('a[href="#home"]');
    
    logoutLink.addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.clear();
        window.location.href = "../html/login1.html";
    });

    menuButton.addEventListener('click', function () {
        if (subMenu.classList.contains('visible')) {
            subMenu.classList.remove('visible');
            setTimeout(() => {
                subMenu.style.display = 'none';
            }, 300);
        } else {
            subMenu.style.display = 'block';
            setTimeout(() => {
                subMenu.classList.add('visible');
            }, 0);
        }
    });

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    servicesLink.addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("services").scrollIntoView({ behavior: "smooth" });
        subMenu.classList.remove('visible');
        setTimeout(() => {
            subMenu.style.display = 'none';
        }, 300);
    });
    
    staffLink.addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("staff").scrollIntoView({ behavior: "smooth" });
        subMenu.classList.remove('visible');
        setTimeout(() => {
            subMenu.style.display = 'none';
        }, 300);
    });
    
    galleryLink.addEventListener("click", function(event) {
        smoothScroll(event, "gallery");
    });
    
    aboutLink.addEventListener("click", function(event) {
        smoothScroll(event, "about");
    });

    // Add event listener for Home link
    homeLink.addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
        subMenu.classList.remove('visible');
        setTimeout(() => {
            subMenu.style.display = 'none';
        }, 300);
    });
    
    function cloneItems() {
        galleryItems.forEach(item => {
            const clone = item.cloneNode(true);
            galleryContainer.appendChild(clone);
        });
    }
    
    cloneItems();
    
    galleryContainer.addEventListener('wheel', (event) => {
        event.preventDefault();
        document.getElementById("about").scrollIntoView({ behavior: "smooth" });
        subMenu.classList.remove('visible');
        setTimeout(() => {
            subMenu.style.display = 'none';
        }, 300);
    });
});
