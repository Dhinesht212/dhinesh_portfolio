
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-menu a");
    const currentYear = document.getElementById("currentYear");

    // Update the copyright year automatically.
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Mobile navigation: open and close.
    function closeMenu() {
        if (!menuToggle || !navMenu) return;

        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navMenu.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        });

        navLinks.forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", function (event) {
            const clickedMenu = navMenu.contains(event.target);
            const clickedButton = menuToggle.contains(event.target);

            if (!clickedMenu && !clickedButton) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    }

    // Smooth-scroll to sections when a navigation link is selected.
    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) return;

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                event.preventDefault();
                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // Reveal sections and cards as they enter the viewport.
    const revealItems = document.querySelectorAll(
        ".hero-copy, .hero-panel, .section-heading, .about-copy, " +
        ".profile-card, .education-inline, .skill-card, .project-card, " +
        ".timeline-item, .resume-actions, .resume-viewer, .contact-content"
    );

    revealItems.forEach(function (item, index) {
        item.classList.add("reveal");
        item.style.transitionDelay = (index % 4) * 90 + "ms";
    });

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealItems.forEach(function (item) {
            revealObserver.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add("is-visible");
        });
    }

    // Highlight the navigation item for the section currently in view.
    const sections = document.querySelectorAll("main section[id]");

    function updateActiveLink() {
        let activeSection = "";

        sections.forEach(function (section) {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= 150) {
                activeSection = section.id;
            }
        });

        navLinks.forEach(function (link) {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + activeSection
            );
        });
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();

    // Optional rotating role text in the hero section.
    const typingElement = document.querySelector(".typing-text");
    const roles = [
        "Java Full Stack Developer",
        "Backend Developer",
        "Web Application Developer"
    ];

    if (typingElement && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        let roleIndex = 0;
        let characterIndex = roles[0].length;
        let deleting = true;

        function typeRole() {
            const currentRole = roles[roleIndex];

            if (deleting) {
                characterIndex--;
                typingElement.textContent = currentRole.substring(0, characterIndex);

                if (characterIndex <= 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(typeRole, 350);
                    return;
                }

                setTimeout(typeRole, 45);
            } else {
                const nextRole = roles[roleIndex];
                characterIndex++;
                typingElement.textContent = nextRole.substring(0, characterIndex);

                if (characterIndex >= nextRole.length) {
                    deleting = true;
                    setTimeout(typeRole, 1700);
                    return;
                }

                setTimeout(typeRole, 75);
            }
        }

        setTimeout(typeRole, 2200);
    }
});
