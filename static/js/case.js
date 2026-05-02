(function() {
    const lenis = window.__lenis;
    const disableScrollAnimations = Boolean(window.__disableScrollAnimations);

    if (!disableScrollAnimations) {
        // Hero parallax
        gsap.to('.page-hero .hero-content', {
            y: -100, opacity: 0, ease: 'none',
            scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true }
        });
    }

    // Before/After slider
    const baSlider = document.getElementById('baSlider');
    const baAfter = baSlider.querySelector('.ba-after');
    const baHandle = document.getElementById('baHandle');
    let isDragging = false;

    function updateSlider(x) {
        const rect = baSlider.getBoundingClientRect();
        let percent = ((x - rect.left) / rect.width) * 100;
        percent = Math.max(5, Math.min(95, percent));
        baAfter.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        baHandle.style.left = percent + '%';
    }

    baSlider.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e.clientX); });
    baSlider.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX); });
    window.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('touchend', () => { isDragging = false; });

    if (!disableScrollAnimations) {
        // Animate sections
        gsap.from('.work-grid .process-card', {
            opacity: 0, y: 60, scale: 0.95, duration: 0.8, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: '.work-grid', start: 'top 82%', toggleActions: 'play none none none' }
        });

        gsap.from('.gallery-item', {
            opacity: 0, y: 50, scale: 0.95, duration: 0.7, stagger: 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: '.gallery-grid', start: 'top 80%', toggleActions: 'play none none none' }
        });

        gsap.from('.cta-card', {
            scale: 0.85, opacity: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.cta', start: 'top 75%', toggleActions: 'play none none none' }
        });

        gsap.utils.toArray('.section-title .word').forEach((word, i) => {
            gsap.from(word, {
                y: '100%', opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power4.out',
                scrollTrigger: { trigger: word.closest('.section-header'), start: 'top 85%', toggleActions: 'play none none none' }
            });
        });
    }
})();
