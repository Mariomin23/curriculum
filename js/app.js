document.addEventListener('DOMContentLoaded', () => {
    // Theme Logic
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');

    const updateIcons = (theme) => {
        if (theme === 'dark') {
            sunIcon.classList.remove('d-none');
            moonIcon.classList.add('d-none');
        } else {
            sunIcon.classList.add('d-none');
            moonIcon.classList.remove('d-none');
        }
    };

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-bs-theme', savedTheme);
    updateIcons(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcons(newTheme);
    });

    // Logging for "Technical detail"
    console.log('%cMario Minuesa Portfolio %cLoaded with details.', 'color: #0d6efd; font-weight: bold; font-size: 1.2rem', 'color: inherit');
});
