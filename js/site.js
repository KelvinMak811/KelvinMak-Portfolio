(function () {
    const page = document.body.dataset.page;
    if (page) {
        const activeLink = document.getElementById(`nav-${page}`);
        if (activeLink) {
            activeLink.classList.add("is-active");
            activeLink.setAttribute("aria-current", "page");
        }
    }

    const tabButtons = Array.from(document.querySelectorAll("[data-project-cat-tab]"));
    const tabPanels = Array.from(document.querySelectorAll("[data-project-cat-panel]"));

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const category = button.dataset.projectCatTab;

            tabButtons.forEach((tab) => {
                const isActive = tab === button;
                tab.setAttribute("aria-selected", String(isActive));
            });

            tabPanels.forEach((panel) => {
                const isActive = panel.dataset.projectCatPanel === category;
                panel.hidden = !isActive;
                panel.classList.toggle("hidden", !isActive);
            });
        });
    });

    const lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Full-size project preview");
    lightbox.innerHTML = `
        <button type="button" class="image-lightbox-close" aria-label="Close full-size preview">&times;</button>
        <img alt="">
        <p class="image-lightbox-caption"></p>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector(".image-lightbox-caption");
    const lightboxClose = lightbox.querySelector(".image-lightbox-close");

    const closeLightbox = () => {
        lightbox.classList.remove("is-open");
        document.body.style.overflow = "";
        if (lightboxImage) {
            lightboxImage.removeAttribute("src");
        }
    };

    const openLightbox = (src, alt) => {
        if (!lightboxImage || !src) {
            return;
        }
        lightboxImage.src = src;
        lightboxImage.alt = alt || "Full-size project preview";
        if (lightboxCaption) {
            lightboxCaption.textContent = alt || "";
        }
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
        if (lightboxClose) {
            lightboxClose.focus();
        }
    };

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
            closeLightbox();
        }
    });

    document.querySelectorAll(".project-slider").forEach((slider) => {
        let images = [];
        try {
            images = JSON.parse(slider.dataset.sliderImages || "[]");
        } catch (error) {
            images = [];
        }

        const image = slider.querySelector(".project-slider-img");
        const prev = slider.querySelector(".slider-prev");
        const next = slider.querySelector(".slider-next");
        const dots = slider.querySelector(".slider-dots");
        const alt = slider.dataset.sliderAlt || "Project image";

        if (!image || images.length === 0) {
            return;
        }

        let currentIndex = 0;

        const render = () => {
            image.src = images[currentIndex];
            image.alt = images.length > 1 ? `${alt} ${currentIndex + 1}` : alt;

            if (dots) {
                Array.from(dots.children).forEach((dot, index) => {
                    dot.classList.toggle("is-active", index === currentIndex);
                    dot.setAttribute("aria-current", index === currentIndex ? "true" : "false");
                });
            }
        };

        const move = (direction) => {
            currentIndex = (currentIndex + direction + images.length) % images.length;
            render();
        };

        image.addEventListener("error", () => {
            slider.classList.add("project-media-fallback");
            slider.innerHTML = `<div><p class="eyebrow mb-3">Project image</p><p class="text-2xl font-bold">${alt}</p><p class="text-sm mt-3 opacity-90">Image asset is not available in this checkout.</p></div>`;
        }, { once: true });

        image.addEventListener("click", () => {
            openLightbox(images[currentIndex], image.alt);
        });

        if (images.length < 2) {
            if (prev) prev.hidden = true;
            if (next) next.hidden = true;
            if (dots) dots.hidden = true;
            render();
            return;
        }

        if (dots) {
            dots.innerHTML = "";
            images.forEach((_, index) => {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.className = "slider-dot";
                dot.setAttribute("aria-label", `Show image ${index + 1}`);
                dot.addEventListener("click", () => {
                    currentIndex = index;
                    render();
                });
                dots.appendChild(dot);
            });
        }

        if (prev) {
            prev.addEventListener("click", () => move(-1));
        }
        if (next) {
            next.addEventListener("click", () => move(1));
        }

        render();
    });

    const contactForm = document.querySelector("[data-contact-form]");
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const status = contactForm.querySelector("[data-form-status]");
            if (status) {
                status.textContent = "Thanks. This demo form has been checked locally. Please email Kelvin directly for delivery.";
            }
            contactForm.reset();
        });
    }
}());
