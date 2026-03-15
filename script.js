/* ============================================================
   Tech Wizard 2.0 – script.js
   IMPORTANT: Replace GOOGLE_FORM_REG_URL and GOOGLE_FORM_FB_URL
   with your actual Google Form short URLs before deploying.
   ============================================================ */

const GOOGLE_FORM_REG_URL = 'https://forms.gle/rr1Cec1S5cX1nsrG7';
const GOOGLE_FORM_FB_URL = 'https://forms.gle/YOUR_FEEDBACK_FORM_ID';

/* ===== FEEDBACK PAGE SECURITY CHECK ===== */
(function() {
    // Reveal date: 27th March 2026, 00:00:00 IST
    const showFeedbackDate = new Date('2026-03-27T00:00:00+05:30').getTime();
    const now = new Date().getTime();
    
    // Allow admin bypass via URL parameter "?admin=true"
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
        sessionStorage.setItem('tw_admin_access', 'true');
    }
    const isAdmin = sessionStorage.getItem('tw_admin_access') === 'true';

    const isAuthorized = (now >= showFeedbackDate) || isAdmin;

    if (!isAuthorized) {
        // Hide feedback links when DOM builds
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('a[href*="feedback.html"]').forEach(link => {
                if (link.parentElement && link.parentElement.tagName === 'LI') {
                    link.parentElement.style.display = 'none';
                } else {
                    link.style.display = 'none';
                }
            });
        });

        // Eject if someone forces the URL
        if (window.location.pathname.endsWith('feedback.html')) {
            window.location.replace('index.html');
        }
    }
})();

/* ===== PARTICLES ===== */
(function () {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function randomColor() {
        const cols = ['rgba(180,79,255,', 'rgba(0,245,255,', 'rgba(255,45,120,'];
        return cols[Math.floor(Math.random() * cols.length)];
    }

    function Particle() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.6 + 0.1;
        this.col = randomColor();
    }

    function init() {
        particles = [];
        const count = Math.floor((W * H) / 8000);
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.col + p.alpha + ')';
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); init(); });
    resize(); init(); draw();
})();

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
}

/* ===== HAMBURGER & MOBILE DROPDOWN ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navDropdowns = document.querySelectorAll('.nav-dropdown');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open');
        document.body.classList.toggle('nav-menu-open');
        
        // Prevent scrolling when menu is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Handle clicks on nav links
    navLinks.querySelectorAll('li > a').forEach(a => {
        a.addEventListener('click', (e) => {
            const parent = a.parentElement;
            
            // If it's a dropdown, toggle it on mobile instead of closing menu
            if (parent.classList.contains('nav-dropdown') && window.innerWidth <= 768) {
                e.preventDefault();
                parent.classList.toggle('active');
                return;
            }

            // For normal links, close the menu
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            document.body.classList.remove('nav-menu-open');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            document.body.classList.remove('nav-menu-open');
            document.body.style.overflow = '';
        }
    });
}

/* ===== COUNTDOWN ===== */
(function () {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    const target = new Date('2026-03-22T23:59:00+05:30').getTime();
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    function pad(n) { return String(n).padStart(2, '0'); }

    function registrationOver() {
        const regButtons = document.querySelectorAll('a[href="register.html"], .nav-cta, #reg-submit-btn');
        regButtons.forEach(btn => {
            btn.innerHTML = 'Registration Closed';
            btn.classList.add('btn-disabled');
            btn.setAttribute('href', 'javascript:void(0)');
            btn.onclick = null;
        });
    }

    function tick() {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minsEl) minsEl.textContent = '00';
            if (secsEl) secsEl.textContent = '00';
            registrationOver();
            return;
        }

        if (daysEl) daysEl.textContent = pad(Math.floor(diff / 86400000));
        if (hoursEl) hoursEl.textContent = pad(Math.floor((diff % 86400000) / 3600000));
        if (minsEl) minsEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
        if (secsEl) secsEl.textContent = pad(Math.floor((diff % 60000) / 1000));
    }

    tick();
    setInterval(tick, 1000);
})();

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.parentElement;
        if (!item) return;

        const isActive = item.classList.contains('active');

        // Close all other items
        document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

        // Toggle current item
        if (!isActive) {
            item.classList.add('active');
        }
    });
});


/* ===== SCHEDULE TABS ===== */
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        const targetPanel = document.getElementById(tabId);

        if (!targetPanel) return;

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        targetPanel.classList.add('active');
    });
});

/* ===== MODAL HELPER ===== */
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalProceed = document.getElementById('modal-proceed-btn');
const modalCancel = document.getElementById('modal-cancel');

function openModal(title, desc, url) {
    if (!modalOverlay || !modalTitle || !modalDesc || !modalProceed) return;

    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalProceed.href = url;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

if (modalCancel) {
    modalCancel.addEventListener('click', closeModal);
}
if (modalProceed) {
    modalProceed.addEventListener('click', closeModal);
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
}

function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

/* ===== FEEDBACK BUTTON ===== */
const fbBtn = document.getElementById('fb-submit-btn');
if (fbBtn) {
    fbBtn.addEventListener('click', () => {
        openModal(
            '📝 Proceed to Feedback Form',
            'Thank you for your feedback! You\'re being redirected to the official Google Form to complete and submit your response.',
            GOOGLE_FORM_FB_URL
        );
    });
}

/* ===== INTERSECTION OBSERVER – fade in sections ===== */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.problem-card, .rule-item, .prize-card, .gallery-item, .tl-item, .highlight-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

