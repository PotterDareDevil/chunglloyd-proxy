// Custom Cursor - Fixed positioning
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(cursorDot);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    document.addEventListener('mousemove', (e) => {
        // Use pageX/pageY for scroll-aware positioning
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant dot movement
        dotX = mouseX;
        dotY = mouseY;
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
    });

    // Smooth cursor follow
    function animate() {
        const diffX = mouseX - cursorX;
        const diffY = mouseY - cursorY;
        
        cursorX += diffX * 0.15;
        cursorY += diffY * 0.15;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animate);
    }
    animate();

    // Hover effects - use event delegation for dynamic elements
    document.addEventListener('mouseover', (e) => {
        if (e.target.matches('a, button, input, textarea, select, .app-card, .game-card, [onclick], .nav-buttons a')) {
            cursor.classList.add('hover');
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.matches('a, button, input, textarea, select, .app-card, .game-card, [onclick], .nav-buttons a')) {
            cursor.classList.remove('hover');
        }
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });
});
