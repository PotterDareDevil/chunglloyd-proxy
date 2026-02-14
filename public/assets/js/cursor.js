// Custom Cursor - Single Dynamic Dot
document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(cursorDot);

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Hover effects - use event delegation for dynamic elements
    document.addEventListener('mouseover', (e) => {
        if (e.target.matches('a, button, input, textarea, select, .app-card, .game-card, [onclick], .nav-buttons a, i')) {
            cursorDot.classList.add('hover');
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.matches('a, button, input, textarea, select, .app-card, .game-card, [onclick], .nav-buttons a, i')) {
            cursorDot.classList.remove('hover');
        }
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        cursorDot.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
        cursorDot.classList.remove('click');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
    });
});
