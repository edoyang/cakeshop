document.addEventListener('DOMContentLoaded', function() {
    const element = document.getElementById('demo');
    let isDown = false;
    let startX;
    let scrollLeft;

    element.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
    });

    element.addEventListener('mouseleave', () => {
        isDown = false;
    });

    element.addEventListener('mouseup', () => {
        isDown = false;
    });

    element.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - element.offsetLeft;
        const walk = (x - startX) * 1; // The number 3 determines the scroll speed
        element.scrollLeft = scrollLeft - walk;
    });
});
