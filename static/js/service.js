(function() {
    'use strict';

    // Hero parallax
    gsap.to('.page-hero .hero-content', {
        y: -80, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Description fade in
    gsap.from('.service-info', {
        opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.service-content', start: 'top 85%', toggleActions: 'play none none none' }
    });

    // Each service step animates individually when it enters viewport
    document.querySelectorAll('.service-step').forEach(function(step, i) {
        gsap.from(step, {
            opacity: 0, x: 20, duration: 0.5, delay: 0.05, ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 92%', toggleActions: 'play none none none' }
        });
    });

    // Tags reveal
    gsap.from('.service-tag', {
        opacity: 0, scale: 0.9, duration: 0.3, stagger: 0.04, ease: 'power3.out',
        scrollTrigger: { trigger: '.service-tags', start: 'top 95%', toggleActions: 'play none none none' }
    });

    // Gallery
    gsap.from('.gallery-item', {
        opacity: 0, y: 40, scale: 0.95, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.gallery-grid', start: 'top 85%', toggleActions: 'play none none none' }
    });

    // CTA
    gsap.from('.cta-card', {
        scale: 0.9, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta', start: 'top 80%', toggleActions: 'play none none none' }
    });

    // Section titles
    gsap.utils.toArray('.section-title .word').forEach(function(word, i) {
        gsap.from(word, {
            y: '100%', opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power4.out',
            scrollTrigger: { trigger: word.closest('.section-header'), start: 'top 85%', toggleActions: 'play none none none' }
        });
    });

    // Pre-fill service in modal
    document.querySelectorAll('[data-service]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var select = document.getElementById('formService');
            if (select) {
                for (var i = 0; i < select.options.length; i++) {
                    if (select.options[i].value === btn.dataset.service || select.options[i].textContent === btn.dataset.service) {
                        select.value = select.options[i].value;
                        break;
                    }
                }
            }
        });
    });
})();
