/**
 * GSAP & SCROLLTRIGGER ANIMATIONS MODULE
 * Registers plugins and manages scroll-driven animations across portfolio sections.
 */

class PortfolioAnimations {
    constructor() {
        this.initGSAP();
    }

    initGSAP() {
        try {
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
                console.log('GSAP & ScrollTrigger successfully initialized.');
            } else {
                console.warn('GSAP or ScrollTrigger library missing. Animations will be skipped safely.');
            }
        } catch (err) {
            console.error('Error initializing GSAP plugins:', err);
        }
    }

    // Ultra-luxury GSAP reveal timeline for Hero section elements
    initHeroTextReveal() {
        if (typeof gsap === 'undefined') return;

        try {
            const reveals = document.querySelectorAll('.hero-reveal');
            if (!reveals || reveals.length === 0) return;

            const tl = gsap.timeline({ delay: 0.15 });

            // Navbar fade down
            tl.fromTo('#header', 
                { opacity: 0, y: -30 }, 
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
            );

            // Left content elements stagger reveal
            tl.fromTo('.hero-content .hero-reveal', 
                { opacity: 0, y: 40, filter: 'blur(8px)' }, 
                { 
                    opacity: 1, 
                    y: 0, 
                    filter: 'blur(0px)', 
                    duration: 1.1, 
                    stagger: 0.14, 
                    ease: 'power3.out' 
                }, 
                '-=0.7'
            );

            // Portrait container scale & glow reveal
            tl.fromTo('.luxury-portrait-wrapper', 
                { opacity: 0, scale: 0.9, y: 30 }, 
                { opacity: 1, scale: 1, y: 0, duration: 1.3, ease: 'power3.out' }, 
                '-=0.9'
            );

            // Red glow pulse animation
            tl.fromTo('.hero-ambient-red', 
                { opacity: 0, scale: 0.7 }, 
                { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }, 
                '-=1.2'
            );

            // Enable Mouse Parallax & Scroll Zoom after reveal
            this.initMouseParallax();
            this.initHeroScrollZoom();
            this.initSkillBars();

        } catch (err) {
            console.error('Error in initHeroTextReveal animation:', err);
        }
    }

    // Mouse 3D Parallax movement on hero portrait & floating cards
    initMouseParallax() {
        if (typeof gsap === 'undefined') return;

        const heroSection = document.getElementById('hero');
        const showcaseCard = document.getElementById('hero-showcase-3d');
        const floatingCards = document.querySelectorAll('.hero-software-card');

        if (!heroSection || !showcaseCard) return;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
            const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

            // Tilt & translate showcase container
            gsap.to(showcaseCard, {
                rotationY: mouseX * 12,
                rotationX: -mouseY * 12,
                x: mouseX * 15,
                y: mouseY * 15,
                duration: 0.8,
                ease: 'power2.out'
            });

            // Parallax shift floating mini cards
            floatingCards.forEach((card, idx) => {
                const depth = (idx + 1) * 6;
                gsap.to(card, {
                    x: mouseX * depth,
                    y: mouseY * depth,
                    duration: 0.9,
                    ease: 'power2.out'
                });
            });
        });

        // Reset on mouse leave
        heroSection.addEventListener('mouseleave', () => {
            gsap.to(showcaseCard, {
                rotationY: 0,
                rotationX: 0,
                x: 0,
                y: 0,
                duration: 1.2,
                ease: 'power2.out'
            });

            floatingCards.forEach((card) => {
                gsap.to(card, {
                    x: 0,
                    y: 0,
                    duration: 1.2,
                    ease: 'power2.out'
                });
            });
        });

        this.initAboutParallax();
    }

    // Mouse 3D Parallax movement on About visual panel & floating chips
    initAboutParallax() {
        if (typeof gsap === 'undefined') return;

        const aboutSection = document.getElementById('about');
        const aboutPanel = document.getElementById('about-visual-panel');
        const aboutChips = document.querySelectorAll('.about-software-chip');

        if (!aboutSection || !aboutPanel) return;

        aboutSection.addEventListener('mousemove', (e) => {
            const rect = aboutSection.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
            const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(aboutPanel, {
                rotationY: mouseX * 10,
                rotationX: -mouseY * 10,
                duration: 0.8,
                ease: 'power2.out'
            });

            aboutChips.forEach((chip, idx) => {
                const depth = (idx + 1) * 4;
                gsap.to(chip, {
                    x: mouseX * depth,
                    y: mouseY * depth,
                    duration: 0.9,
                    ease: 'power2.out'
                });
            });
        });

        aboutSection.addEventListener('mouseleave', () => {
            gsap.to(aboutPanel, {
                rotationY: 0,
                rotationX: 0,
                duration: 1.2,
                ease: 'power2.out'
            });

            aboutChips.forEach((chip) => {
                gsap.to(chip, {
                    x: 0,
                    y: 0,
                    duration: 1.2,
                    ease: 'power2.out'
                });
            });
        });
    }

    // Hero section scroll zoom & parallax effect
    initHeroScrollZoom() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        try {
            const heroSection = document.getElementById('hero');
            if (!heroSection) return;

            gsap.to(heroSection, {
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.5
                },
                scale: 1.04,
                y: 80,
                opacity: 0.85,
                ease: 'none'
            });
        } catch (err) {
            console.error('Error in initHeroScrollZoom:', err);
        }
    }

    // Skill bar width animation on scroll
    initSkillBars() {
        try {
            const skillBars = document.querySelectorAll('.skill-progress');
            if (!skillBars || skillBars.length === 0) return;

            skillBars.forEach((bar) => {
                const targetWidth = bar.getAttribute('data-progress') || '85%';
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.create({
                        trigger: bar,
                        start: 'top 85%',
                        onEnter: () => {
                            bar.style.width = targetWidth;
                        }
                    });
                } else {
                    bar.style.width = targetWidth;
                }
            });
        } catch (err) {
            console.error('Error in initSkillBars:', err);
        }
    }

    // Fade-up animation helper for section elements
    initFadeUp() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        try {
            const elements = document.querySelectorAll('.animate-fade-up');
            if (elements && elements.length > 0) {
                elements.forEach((el) => {
                    if (!el) return;
                    gsap.fromTo(el, 
                        { opacity: 0, y: 40 }, 
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: el,
                                start: 'top 85%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
                });
            }

            this.initAutomotiveStagger();
        } catch (err) {
            console.error('Error in initFadeUp animation:', err);
        }
    }

    // Automotive stagger entrance reveal animation (Left -> Center -> Right, blur-to-sharp)
    initAutomotiveStagger() {
        try {
            const frame = document.querySelector('.auto-luxury-frame');
            const cards = document.querySelectorAll('.auto-stagger-card');
            if (!frame || !cards || cards.length === 0) return;

            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                cards.forEach((card, idx) => {
                    const isCenter = card.classList.contains('card-center');
                    const targetScale = isCenter ? 1.08 : 1;

                    gsap.fromTo(card,
                        { opacity: 0, y: 35, scale: 0.94, filter: 'blur(8px)' },
                        {
                            opacity: 1,
                            y: 0,
                            scale: targetScale,
                            filter: 'blur(0px)',
                            duration: 0.9,
                            delay: idx * 0.18,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: frame,
                                start: 'top 82%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
                });
            } else {
                cards.forEach((card) => card.classList.add('in-view'));
            }
        } catch (err) {
            console.error('Error in initAutomotiveStagger:', err);
        }
    }

    // Number counter animation helper
    initCounterAnimations() {
        if (typeof gsap === 'undefined') return;

        try {
            const counters = document.querySelectorAll('.stat-number[data-target]');
            if (!counters || counters.length === 0) return;

            counters.forEach((counter) => {
                if (!counter) return;
                const targetAttr = counter.getAttribute('data-target');
                const target = targetAttr ? parseInt(targetAttr, 10) : 0;
                const hasPlus = counter.innerText.includes('+') || true;
                const suffix = hasPlus ? '+' : '';

                gsap.to(counter, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    scrollTrigger: typeof ScrollTrigger !== 'undefined' ? {
                        trigger: counter,
                        start: 'top 85%'
                    } : null,
                    onUpdate: function() {
                        counter.innerText = Math.ceil(counter.innerText) + suffix;
                    }
                });
            });
        } catch (err) {
            console.error('Error in initCounterAnimations:', err);
        }
    }
}

window.portfolioAnimations = new PortfolioAnimations();

