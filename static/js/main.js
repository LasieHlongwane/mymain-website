// ==========================================
// MOBILE NAVIGATION
// ==========================================

const menuButton =
    document.getElementById("menu-button");

const navMenu =
    document.getElementById("nav-menu");


menuButton.addEventListener("click", () => {

    navMenu.classList.toggle("show");

});


// Close mobile menu after clicking a navigation link.

const navLinks =
    navMenu.querySelectorAll("a");


navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("show");

    });

});


// ==========================================
// COPYRIGHT YEAR
// ==========================================

const copyright =
    document.getElementById("copyright");

const currentYear =
    new Date().getFullYear();


copyright.textContent =
    `© ${currentYear} Local Access Courier`;