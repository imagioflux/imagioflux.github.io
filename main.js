// script.js
document.addEventListener('DOMContentLoaded', (event) => {
    const ribbon = document.getElementById('ribbon');

    // Add a very small delay to ensure the element is rendered
    setTimeout(() => {
        ribbon.classList.add('show');
    }, 10); // 10 milliseconds is usually enough
});

// main.js
document.addEventListener('DOMContentLoaded', () => {
    const section1 = document.querySelector('.section-1');
    const contentWrapper = section1.querySelector('.content-wrapper-1'); // Get the wrapper

    if (contentWrapper) { // Check if the wrapper exists
        requestAnimationFrame(() => {
            requestAnimationFrame(() => { // Double request for better consistency
                section1.classList.add('loaded');
            });
        });
    }
});
