(function() {
    const lenis = window.__lenis;
    const reduceMotion = Boolean(window.__reduceMotion);

    if (!reduceMotion) {
        // Hero parallax
        gsap.to('.page-hero .hero-content', {
            y: -100, opacity: 0, ease: 'none',
            scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true }
        });

        // About blocks reveal
        gsap.from('.about-block', {
            opacity: 0, y: 40, duration: 0.8, stagger: 0.2, ease: 'power3.out',
            scrollTrigger: { trigger: '.about-content', start: 'top 80%', toggleActions: 'play none none none' }
        });

        // Team cards stagger
        gsap.from('.team-card', {
            opacity: 0, y: 50, scale: 0.95, duration: 0.7, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: '.team-grid', start: 'top 80%', toggleActions: 'play none none none' }
        });

        // Stats
        gsap.fromTo('.stat', { opacity: 0, y: 40, scale: 0.9 }, {
            opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: '.about-stats', start: 'top 80%', toggleActions: 'play none none none' }
        });

        // CTA
        gsap.from('.cta-card', {
            scale: 0.85, opacity: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.cta', start: 'top 75%', toggleActions: 'play none none none' }
        });

        // Section titles
        gsap.utils.toArray('.section-title .word').forEach((word, i) => {
            gsap.from(word, {
                y: '100%', opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power4.out',
                scrollTrigger: { trigger: word.closest('.section-header'), start: 'top 85%', toggleActions: 'play none none none' }
            });
        });
    }
})();
