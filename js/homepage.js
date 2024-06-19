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

    function smoothScroll(event, sectionId) {
        event.preventDefault();
        document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
        subMenu.classList.remove('visible');
        setTimeout(() => {
            subMenu.style.display = 'none';
        }, 300);
    }

    servicesLink.addEventListener("click", function(event) {
        smoothScroll(event, "services");
    });

    staffLink.addEventListener("click", function(event) {
        smoothScroll(event, "staff");
    });

    galleryLink.addEventListener("click", function(event) {
        smoothScroll(event, "gallery");
    });

    aboutLink.addEventListener("click", function(event) {
        smoothScroll(event, "about");
    });

    homeLink.addEventListener("click", function(event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
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
        const scrollAmount = event.deltaY;
        galleryContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    galleryContainer.addEventListener('mouseenter', () => {
        galleryContainer.classList.add('paused');
    });
    
    galleryContainer.addEventListener('mouseleave', () => {
        galleryContainer.classList.remove('paused');
    });
    
    galleryContainer.addEventListener('scroll', () => {
        const maxScrollLeft = galleryContainer.scrollWidth - galleryContainer.clientWidth;
        if (!galleryContainer.classList.contains('paused') && galleryContainer.scrollLeft >= maxScrollLeft - 50) {
            cloneItems();
        }
    });
});