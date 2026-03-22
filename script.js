/* ===== Menu Icon Navbar Toggle ===== */
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

/* ===== Scroll Sections Active Link & Sticky Header ===== */
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    let top = window.scrollY;

    // Active link highlighting
    sections.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });

    // Sticky header
    let header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 100);

    // Remove toggle icon and navbar when click navbar link (scroll)
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

/* ===== Scroll Reveals (Intersection Observer) ===== */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 });

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

/* ===== Lightbox Modal ===== */
function openLightbox(src, type) {
    const modal = document.getElementById('lightboxModal');
    const content = document.getElementById('lightboxContent');

    if (type === 'image') {
        content.innerHTML = `<img src="${src}" alt="Certificate View">`;
    } else if (type === 'pdf') {
        content.innerHTML = `<iframe src="${src}" title="CV Viewer"></iframe>`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    const content = document.getElementById('lightboxContent');

    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Clear content after transition
    setTimeout(() => {
        content.innerHTML = '';
    }, 300);
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

/* ===== EmailJS Contact Form ===== */

// ⚠️ REPLACE THESE WITH YOUR ACTUAL EmailJS CREDENTIALS
const EMAILJS_PUBLIC_KEY = 'C-07waA6lJMNHTATo';
const EMAILJS_SERVICE_ID = 'service_3vap3tm';
const EMAILJS_TEMPLATE_ID = 'template_n6yfg59';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Toast notification helper
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Form submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending... <i class="bx bx-loader-alt bx-spin"></i>';
    submitBtn.disabled = true;

    // Gather form data — these keys must match your EmailJS template variables
    const templateParams = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        phone: contactForm.phone.value || 'Not provided',
        subject: contactForm.subject.value,
        message: contactForm.message.value,
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
            showToast('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        })
        .catch((error) => {
            console.error('EmailJS error:', error);
            showToast('❌ Failed to send message. Please try again.', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
});
