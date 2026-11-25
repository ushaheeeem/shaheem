/**
 * MAIN APP MODULE
 * Handles Lenis Smooth Scroll, robust Preloader logic, and sub-module initialization.
 */

let isPreloaderDismissed = false;

function initApp() {
    // 1. Initialize Lenis Smooth Scroll safely
    try {
        initLenis();
    } catch (err) {
        console.error('Error initializing Lenis:', err);
    }

    // 2. Initialize Preloader safely
    try {
        initPreloader();
    } catch (err) {
        console.error('Error initializing Preloader:', err);
        dismissPreloader();
    }

    // 3. Initialize Video Lightbox Modal safely
    try {
        initVideoModal();
    } catch (err) {
        console.error('Error initializing Video Modal:', err);
    }

    // 4. Initialize Mobile Overlay Menu safely
    try {
        initMobileMenu();
    } catch (err) {
        console.error('Error initializing Mobile Menu:', err);
    }

    console.log('Portfolio project shell initialized cleanly.');
}

// Safely execute initApp regardless of script loading timing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

/**
 * Video Lightbox Modal logic (Supports both YouTube iframes & HTML5 local MP4 videos)
 */
function initVideoModal() {
    const modal = document.getElementById('video-modal');
    const modalIframe = document.getElementById('video-modal-iframe');
    const modalPlayer = document.getElementById('video-modal-player');
    const modalTitle = document.getElementById('video-modal-title');
    const closeBtn = document.getElementById('video-modal-close');

    if (!modal) return;

    document.querySelectorAll('.video-card-placeholder, [data-video-url]').forEach((card) => {
        // Explicitly exclude Automotive, Motion Graphics, Presentation, Real Estate, Travel, Reels & Shorts, and Before & After sections from opening modals
        if (card.closest('#automotive') || card.closest('#motion-graphics') || card.closest('#presentation-videos') || card.closest('#real-estate') || card.closest('#travel') || card.closest('#reels-shorts') || card.closest('#before-after')) return;

        card.addEventListener('click', (e) => {
            // Prevent event bubbling if clicking nested buttons
            if (e.target.closest('.video-card-placeholder') !== card && e.currentTarget !== card) return;

            const title = card.getAttribute('data-video-title') || 'Featured Video Showcase';
            const embedUrl = card.getAttribute('data-video-url') || 'assets/videos/Automative_2.mp4';
            
            if (modalTitle) modalTitle.textContent = title;

            if (embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm')) {
                if (modalIframe) {
                    modalIframe.style.display = 'none';
                    modalIframe.src = '';
                }
                if (modalPlayer) {
                    modalPlayer.style.display = 'block';
                    modalPlayer.src = embedUrl;
                    modalPlayer.currentTime = 0;
                    modalPlayer.play().catch((err) => console.log('Autoplay error:', err));
                }
            } else {
                if (modalPlayer) {
                    modalPlayer.style.display = 'none';
                    modalPlayer.pause();
                    modalPlayer.src = '';
                }
                if (modalIframe) {
                    modalIframe.style.display = 'block';
                    modalIframe.src = embedUrl;
                }
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        if (modalIframe) {
            modalIframe.src = '';
            modalIframe.style.display = 'none';
        }
        if (modalPlayer) {
            modalPlayer.pause();
            modalPlayer.src = '';
            modalPlayer.style.display = 'none';
        }
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Safely dismisses the preloader and triggers enter animations
 */
function dismissPreloader() {
    if (isPreloaderDismissed) return;
    isPreloaderDismissed = true;

    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    preloader.classList.add('loaded');
    preloader.style.pointerEvents = 'none';

    setTimeout(() => {
        preloader.style.display = 'none';

        // Trigger animations safely after preloader disappears
        try {
            if (window.portfolioAnimations) {
                if (typeof window.portfolioAnimations.initHeroTextReveal === 'function') {
                    window.portfolioAnimations.initHeroTextReveal();
                }
                if (typeof window.portfolioAnimations.initFadeUp === 'function') {
                    window.portfolioAnimations.initFadeUp();
                }
                if (typeof window.portfolioAnimations.initCounterAnimations === 'function') {
                    window.portfolioAnimations.initCounterAnimations();
                }
            }
        } catch (err) {
            console.error('Error triggering portfolio animations:', err);
        }
    }, 600);
}

/**
 * Configure Lenis Smooth Scroll & connect with GSAP ScrollTrigger safely
 */
function initLenis() {
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis library not loaded. Falling back to native scrolling.');
        return;
    }

    try {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        // Synchronize Lenis scroll position with GSAP ScrollTrigger
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        } else {
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }

        window.lenis = lenis;
    } catch (err) {
        console.error('Failed to initialize Lenis smooth scroll:', err);
    }
}

/**
 * Preloader numerical progress counter logic with hard fallback guarantee
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('preloader-progress');
    const progressNum = document.getElementById('preloader-num');

    if (!preloader) {
        dismissPreloader();
        return;
    }

    // Hard fallback timeout: force dismiss after 2 seconds no matter what
    const fallbackTimer = setTimeout(() => {
        dismissPreloader();
    }, 2000);

    let count = 0;
    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 12) + 8;
        if (count >= 100) {
            count = 100;
            clearInterval(interval);
            clearTimeout(fallbackTimer);

            if (progressBar) progressBar.style.width = '100%';
            if (progressNum) progressNum.textContent = '100%';

            setTimeout(() => {
                dismissPreloader();
            }, 300);
        } else {
            if (progressBar) progressBar.style.width = `${count}%`;
            if (progressNum) progressNum.textContent = `${count}%`;
        }
    }, 40);
}

// Window load safety fallback
if (document.readyState === 'complete') {
    setTimeout(() => {
        dismissPreloader();
    }, 1500);
} else {
    window.addEventListener('load', () => {
        setTimeout(() => {
            dismissPreloader();
        }, 1500);
    });
}

// Sticky header background on scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (!header) return;
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/**
 * Full-screen glass mobile menu overlay logic
 */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const mobileClose = document.getElementById('mobile-menu-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .btn-mobile-hire');

    if (!mobileToggle || !mobileOverlay) return;

    function openMobileMenu() {
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileToggle.addEventListener('click', openMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// Absolute fallback safety net (3s max display time)
setTimeout(() => {
    dismissPreloader();
}, 3000);


