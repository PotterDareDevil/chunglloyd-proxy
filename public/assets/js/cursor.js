// Custom Cursor
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
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant dot movement
        dotX = mouseX - 3;
        dotY = mouseY - 3;
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    });

    // Smooth cursor follow
    function animate() {
        const diffX = mouseX - cursorX;
        const diffY = mouseY - cursorY;
        
        cursorX += diffX * 0.15;
        cursorY += diffY * 0.15;
        
        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        
        requestAnimationFrame(animate);
    }
    animate();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, input, .app-card, .game-card, [onclick]');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) scale(1.5)`;
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) scale(1)`;
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
