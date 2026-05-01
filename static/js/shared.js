(() => {
    'use strict';

    // ============================
    // Analytics Tracker
    // ============================
    const analytics = {
        sections: new Set(),
        tabs: [],
        startTime: performance.now(),
        getTimeOnSite() {
            return Math.round((performance.now() - this.startTime) / 1000);
        },
        getData() {
            return {
                sections: [...this.sections],
                tabs: this.tabs,
                timeOnSite: this.getTimeOnSite()
            };
        }
    };

    // Track section visibility
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const name = entry.target.dataset.trackName || entry.target.id;
                if (name) analytics.sections.add(name);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

    // ============================
    // Init GSAP + Lenis
    // ============================
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // ============================
    // Blob Parallax
    // ============================
    document.querySelectorAll('.blob').forEach(blob => {
        const speed = parseFloat(blob.dataset.speed) || 0.05;
        gsap.to(blob, {
            y: () => window.innerHeight * speed * 10,
            ease: 'none',
            scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 }
        });
    });

    // ============================
    // Navbar
    // ============================
    const navbar = document.getElementById('navbar');
    lenis.on('scroll', () => { navbar.classList.toggle('scrolled', lenis.scroll > 50); });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="/#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Only handle if we're on the home page
            if (window.location.pathname === '/') {
                e.preventDefault();
                const hash = link.getAttribute('href').replace('/', '');
                const target = document.querySelector(hash);
                if (target) {
                    lenis.scrollTo(target, { offset: -80 });
                    document.getElementById('mobileNav').classList.remove('active');
                }
            }
        });
    });

    document.querySelectorAll('[data-nav]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    lenis.scrollTo(target, { offset: -80 });
                    document.getElementById('mobileNav').classList.remove('active');
                }
            }
        });
    });

    // Burger menu
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobileNav');
    burger.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });

    // ============================
    // Social FAB
    // ============================
    const socialFab = document.getElementById('socialFab');
    const fabTrigger = socialFab.querySelector('.fab-trigger');
    fabTrigger.addEventListener('click', () => {
        socialFab.classList.toggle('open');
    });

    // Close FAB on outside click
    document.addEventListener('click', (e) => {
        if (!socialFab.contains(e.target)) {
            socialFab.classList.remove('open');
        }
    });

    // ============================
    // Booking Modal
    // ============================
    const modal = document.getElementById('bookingModal');
    const formEl = document.getElementById('bookingForm');
    const successEl = document.getElementById('formSuccess');
    const consent = document.getElementById('formConsent');
    const submitBtn = document.getElementById('formSubmit');

    // Open modal
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            lenis.stop();
            // Close mobile nav if open
            mobileNav.classList.remove('active');
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        lenis.start();
    }

    document.getElementById('modalClose').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closePrivacy(); } });

    // Consent checkbox
    consent.addEventListener('change', () => {
        submitBtn.disabled = !consent.checked;
    });

    // Submit
    submitBtn.addEventListener('click', async () => {
        const name = document.getElementById('formName').value.trim();
        const phone = document.getElementById('formPhone').value.trim();
        const car = document.getElementById('formCar').value.trim();
        const service = document.getElementById('formService').value;
        const comment = document.getElementById('formComment').value.trim();

        if (!name || !phone) {
            alert('Пожалуйста, заполните имя и телефон');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        try {
            const resp = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name, phone, car, service, comment,
                    analytics: analytics.getData()
                })
            });

            if (resp.ok) {
                formEl.style.display = 'none';
                successEl.classList.add('show');
                setTimeout(() => {
                    closeModal();
                    // Reset
                    formEl.style.display = '';
                    successEl.classList.remove('show');
                    document.getElementById('formName').value = '';
                    document.getElementById('formPhone').value = '';
                    document.getElementById('formCar').value = '';
                    document.getElementById('formService').value = '';
                    document.getElementById('formComment').value = '';
                    consent.checked = false;
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Отправить заявку';
                }, 3000);
            } else {
                throw new Error('Server error');
            }
        } catch {
            alert('Произошла ошибка. Попробуйте позвонить нам: +7 951 980 87 77');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заявку';
        }
    });

    // ============================
    // Privacy Modal
    // ============================
    const privacyOverlay = document.getElementById('privacyModal');

    function closePrivacy() {
        privacyOverlay.classList.remove('active');
    }

    document.getElementById('privacyLink').addEventListener('click', (e) => {
        e.preventDefault();
        privacyOverlay.classList.add('active');
    });

    document.getElementById('footerPrivacy').addEventListener('click', (e) => {
        e.preventDefault();
        privacyOverlay.classList.add('active');
    });

    document.getElementById('privacyClose').addEventListener('click', closePrivacy);
    privacyOverlay.addEventListener('click', (e) => { if (e.target === privacyOverlay) closePrivacy(); });

    // Phone input mask (basic)
    const phoneInput = document.getElementById('formPhone');
    phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 0) {
            if (val[0] === '8') val = '7' + val.slice(1);
            if (val[0] !== '7') val = '7' + val;
            let formatted = '+7';
            if (val.length > 1) formatted += ' (' + val.slice(1, 4);
            if (val.length > 4) formatted += ') ' + val.slice(4, 7);
            if (val.length > 7) formatted += '-' + val.slice(7, 9);
            if (val.length > 9) formatted += '-' + val.slice(9, 11);
            e.target.value = formatted;
        }
    });

    // Expose lenis globally for child templates
    window.__lenis = lenis;
    window.__analytics = analytics;

})();
