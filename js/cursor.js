/**
 * CUSTOM CURSOR MODULE
 * Handles smooth cursor tracking, magnetic hover effects, and hover states safely.
 */

function initCursor() {
    try {
        const cursor = document.getElementById('custom-cursor');
        if (!cursor || window.matchMedia('(max-width: 767px)').matches) return;

        const cursorDot = cursor.querySelector('.cursor-dot');
        const cursorRing = cursor.querySelector('.cursor-ring');
        const cursorText = cursor.querySelector('.cursor-text');

        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;

        // Track mouse position
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (cursorDot) {
                cursorDot.style.left = `${mouseX}px`;
                cursorDot.style.top = `${mouseY}px`;
            }
        });

        // Smooth ring animation loop
        function animateCursor() {
            const distXRing = mouseX - ringX;
            const distYRing = mouseY - ringY;

            ringX += distXRing * 0.15;
            ringY += distYRing * 0.15;

            if (cursorRing) {
                cursorRing.style.left = `${ringX}px`;
                cursorRing.style.top = `${ringY}px`;
            }

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover listeners for links and buttons safely
        const interactiveElements = document.querySelectorAll('a, button, .interactive-hover');

        interactiveElements.forEach((el) => {
            if (!el) return;
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering-link');
                const customText = el.getAttribute('data-cursor');
                if (customText && cursorText) {
                    cursorText.textContent = customText;
                    cursorText.style.opacity = '1';
                }
            });

            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering-link');
                if (cursorText) {
                    cursorText.style.opacity = '0';
                }
            });
        });
    } catch (err) {
        console.error('Error in cursor module:', err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
} else {
    initCursor();
}

