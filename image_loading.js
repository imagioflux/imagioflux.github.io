document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('[class^="section-"]');

    sections.forEach(section => {
        const img = new Image();
        const imageUrl = getComputedStyle(section).backgroundImage.slice(5, -2);

        img.onload = () => {
            section.style.backgroundImage = `url('${imageUrl}')`;
        };

        img.src = imageUrl; // Load image immediately
    });
});
