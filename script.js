const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const form = document.querySelector("#contact-form");
const formMessage = document.querySelector("#form-message");
const year = document.querySelector("#year");
const galleryButtons = Array.from(document.querySelectorAll(".gallery-open"));
const lightbox = document.querySelector("#gallery-lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
let activeGalleryIndex = 0;
let lastFocusedElement = null;
let touchStartX = 0;

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.classList.toggle("is-open", !isOpen);
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.classList.remove("is-open");
      navLinks.classList.remove("is-open");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (form && formMessage) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "Thank you. Your message has been prepared for the Namelok Women team.";
    form.reset();
  });
}

const showGalleryPhoto = (index) => {
  if (!galleryButtons.length || !lightboxImage || !lightboxCaption) {
    return;
  }

  activeGalleryIndex = (index + galleryButtons.length) % galleryButtons.length;
  const button = galleryButtons[activeGalleryIndex];
  const image = button.querySelector("img");
  const caption = button.querySelector("figcaption")?.textContent || image?.alt || "";

  if (!image) {
    return;
  }

  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = caption;
};

const openLightbox = (index) => {
  if (!lightbox) {
    return;
  }

  lastFocusedElement = document.activeElement;
  showGalleryPhoto(index);
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  lightboxClose?.focus();
};

const closeLightbox = () => {
  if (!lightbox) {
    return;
  }

  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  if (lightboxImage) {
    lightboxImage.src = "";
  }
  lastFocusedElement?.focus();
};

galleryButtons.forEach((button, index) => {
  button.addEventListener("click", () => openLightbox(index));
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => showGalleryPhoto(activeGalleryIndex - 1));
lightboxNext?.addEventListener("click", () => showGalleryPhoto(activeGalleryIndex + 1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightbox?.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

lightbox?.addEventListener("touchend", (event) => {
  const touchEndX = event.changedTouches[0].clientX;
  const distance = touchEndX - touchStartX;

  if (Math.abs(distance) < 50) {
    return;
  }

  showGalleryPhoto(activeGalleryIndex + (distance < 0 ? 1 : -1));
});

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showGalleryPhoto(activeGalleryIndex - 1);
  }

  if (event.key === "ArrowRight") {
    showGalleryPhoto(activeGalleryIndex + 1);
  }
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
