(() => {
    'use strict';

    const lenis = window.__lenis;
    const analytics = window.__analytics;

    // ============================
    // Preloader
    // ============================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const preloaderChars = preloader.querySelectorAll('.char');
        lenis.stop();

        const preloaderTl = gsap.timeline({
            onComplete: () => {
                gsap.to(preloader, {
                    clipPath: 'inset(0 0 100% 0)',
                    duration: 0.8,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        preloader.style.display = 'none';
                        lenis.start();
                        heroReveal();
                    }
                });
            }
        });

        preloaderTl.to(preloaderChars, {
            y: 0, opacity: 1,
            duration: 0.7, stagger: 0.1,
            ease: 'power4.out', delay: 0.2,
        }).to({}, { duration: 0.4 });
    }

    // ============================
    // Hero Reveal — like original index.html
    // ============================
    function heroReveal() {
        const heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;

        // Setup accent word chars BEFORE making content visible
        const accent = document.querySelector('.hero h1 .accent-word');
        if (accent) {
            const text = accent.textContent;
            accent.innerHTML = '';
            // Group chars by word so words don't break mid-word
            text.split(' ').forEach((word, wi, arr) => {
                const wordWrap = document.createElement('span');
                wordWrap.style.cssText = 'display:inline-block;white-space:nowrap;';
                word.split('').forEach(ch => {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.textContent = ch;
                    span.style.cssText = 'display:inline-block;transform:translateY(120%);color:var(--accent);';
                    wordWrap.appendChild(span);
                });
                accent.appendChild(wordWrap);
                // Add space between words
                if (wi < arr.length - 1) {
                    const space = document.createElement('span');
                    space.className = 'char';
                    space.innerHTML = '&nbsp;';
                    space.style.cssText = 'display:inline-block;transform:translateY(120%);color:var(--accent);';
                    accent.appendChild(space);
                }
            });
            accent.style.transform = 'translateY(0)';
        }

        // Now make content visible — all words are hidden by translateY + overflow:hidden
        heroContent.classList.add('ready');
        const tl = gsap.timeline();

        // Label fade
        tl.to('.hero-label', { opacity: 1, duration: 0.6, ease: 'power3.out' });

        // Line 1
        const line1Words = document.querySelectorAll('.hero h1 .line:first-child .word');
        tl.to(line1Words, { y: 0, duration: 0.8, stagger: 0.12, ease: 'power4.out' }, '-=0.3');

        // Line 2
        const line2Words = document.querySelectorAll('.hero h1 .line:nth-child(2) .word');
        tl.to(line2Words, { y: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' }, '-=0.5');

        // Line 3 — accent chars
        if (accent) {
            tl.to('.accent-word .char', { y: 0, duration: 0.7, stagger: 0.03, ease: 'power4.out' }, '-=0.4');
        }

        // Buttons
        tl.to('.hero-buttons', { opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3');

        // Scroll indicator
        tl.to('.hero-scroll', { opacity: 0.6, duration: 0.8, ease: 'power2.out' }, '-=0.2');

        // Hero parallax on scroll
        gsap.to('.hero-content', {
            y: -150, opacity: 0, ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });

        gsap.to('.hero-scroll', {
            opacity: 0, ease: 'none',
            scrollTrigger: { trigger: '.hero', start: '80% bottom', end: '90% bottom', scrub: true }
        });
    }

    // ============================
    // Marquee
    // ============================
    document.querySelectorAll('.marquee-track').forEach(track => {
        const direction = parseFloat(track.dataset.direction) || -1;
        const speed = parseFloat(track.dataset.speed) || 1;
        const content = track.querySelector('.marquee-content');
        const contentWidth = content.offsetWidth;

        gsap.set(track, { x: direction === -1 ? 0 : -contentWidth });

        const marqueeAnim = gsap.to(track, {
            x: direction === -1 ? -contentWidth : 0,
            duration: 30 / speed, ease: 'none', repeat: -1,
        });

        let scrollVelocity = 0;
        lenis.on('scroll', (e) => { scrollVelocity = Math.abs(e.velocity); });
        gsap.ticker.add(() => {
            marqueeAnim.timeScale(1 + scrollVelocity * 0.3);
            scrollVelocity *= 0.95;
        });
    });

    // ============================
    // About — clip-path reveal
    // ============================
    const aboutCard = document.querySelector('.about-card');
    if (aboutCard) {
        gsap.to('.about-card', {
            clipPath: 'inset(0% 0% 0% 0% round 24px)',
            ease: 'power2.out',
            scrollTrigger: { trigger: '.about', start: 'top 80%', end: 'top 30%', scrub: 1 }
        });

        gsap.utils.toArray('.about-text .split-line span').forEach(line => {
            gsap.from(line, {
                y: '100%', duration: 0.8, ease: 'power4.out',
                scrollTrigger: { trigger: line.closest('.split-line'), start: 'top 85%', toggleActions: 'play none none none' }
            });
        });

        gsap.from('.about-text p', {
            opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.about-text p', start: 'top 85%', toggleActions: 'play none none none' }
        });

        gsap.fromTo('.stat', { opacity: 0, y: 40, scale: 0.9 }, {
            opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: '.about', start: 'top 40%', toggleActions: 'play none none none' }
        });
    }

    // ============================
    // Section headers
    // ============================
    gsap.utils.toArray('.section-title .word').forEach((word, i) => {
        gsap.from(word, {
            y: '100%', opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power4.out',
            scrollTrigger: {
                trigger: word.closest('.section-header'),
                start: 'top 85%', toggleActions: 'play none none none'
            }
        });
    });

    gsap.utils.toArray('.section-subtitle').forEach(sub => {
        gsap.from(sub, {
            opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: sub, start: 'top 90%', toggleActions: 'play none none none' }
        });
    });

    // ============================
    // Services — Tabs
    // ============================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            if (analytics) analytics.tabs.push(target);

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabPanels.forEach(panel => {
                if (panel.dataset.panel === target) {
                    panel.classList.add('active');
                    gsap.fromTo(panel, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });

    // ============================
    // Process cards
    // ============================
    gsap.from('.process-card', {
        opacity: 0, y: 60, scale: 0.95,
        duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.process-grid', start: 'top 82%', toggleActions: 'play none none none' }
    });

    // ============================
    // Cases bento reveal
    // ============================
    gsap.from('.case-card', {
        opacity: 0, y: 50, scale: 0.95,
        duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.cases-bento', start: 'top 80%', toggleActions: 'play none none none' }
    });

    // ============================
    // Gallery reveal
    // ============================
    gsap.from('.gallery-item', {
        opacity: 0, y: 50, scale: 0.95,
        duration: 0.7, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.gallery-grid', start: 'top 80%', toggleActions: 'play none none none' }
    });

    // ============================
    // CTA reveal
    // ============================
    gsap.from('.cta-card', {
        scale: 0.85, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta', start: 'top 75%', toggleActions: 'play none none none' }
    });

    // ============================
    // FIX #6: Lazy-load Yandex Map
    // ============================
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        const mapObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const src = mapContainer.dataset.src;
                    if (src) {
                        const iframe = document.createElement('iframe');
                        iframe.src = src;
                        iframe.allowFullscreen = true;
                        iframe.style.cssText = 'width:100%;height:100%;border:none;filter:grayscale(1) invert(1) brightness(0.8) contrast(1.2);';
                        mapContainer.appendChild(iframe);
                        mapContainer.removeAttribute('data-src');
                    }
                    mapObserver.disconnect();
                }
            });
        }, { rootMargin: '200px' });
        mapObserver.observe(mapContainer);
    }

})();
