// ============================================================
// KALXA MAIN WEBSITE
// main.js
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================================
    // MOBILE NAVIGATION
    // ========================================================

    const menuButton =
        document.getElementById("menu-button");

    const navMenu =
        document.getElementById("nav-menu");


    if (menuButton && navMenu) {

        menuButton.addEventListener(
            "click",
            function () {

                navMenu.classList.toggle("open");

                const menuIsOpen =
                    navMenu.classList.contains("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    menuIsOpen
                        ? "true"
                        : "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    menuIsOpen
                        ? "Close menu"
                        : "Open menu"
                );

                menuButton.textContent =
                    menuIsOpen
                        ? "✕"
                        : "☰";

            }
        );


        // ====================================================
        // CLOSE MOBILE MENU AFTER LINK CLICK
        // ====================================================

        const navigationLinks =
            navMenu.querySelectorAll("a");


        navigationLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navMenu.classList.remove("open");

                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        menuButton.setAttribute(
                            "aria-label",
                            "Open menu"
                        );

                        menuButton.textContent = "☰";

                    }
                );

            }
        );

    }


    // ========================================================
    // SMOOTH INTERNAL NAVIGATION
    // ========================================================

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );


    // ========================================================
    // DYNAMIC COPYRIGHT YEAR
    // ========================================================

    const copyright =
        document.getElementById(
            "copyright"
        );


    if (copyright) {

        const currentYear =
            new Date().getFullYear();


        copyright.textContent =
            "© " +
            currentYear +
            " KALXA. All rights reserved.";

    }


    // ========================================================
    // CLOSE MOBILE MENU WHEN SCREEN BECOMES DESKTOP
    // ========================================================

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 768 &&
                navMenu &&
                menuButton
            ) {

                navMenu.classList.remove(
                    "open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Open menu"
                );

                menuButton.textContent = "☰";

            }

        }
    );

});
