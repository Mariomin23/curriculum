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

    // Language Logic
    const langToggle = document.getElementById('langToggle');
    const langIcon = document.getElementById('langIcon');

    const updateLanguage = (lang) => {
        const t = translations[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                el.innerHTML = t[key];
            }
        });
        // Update tooltips/titles
        langToggle.title = t.nav_lang_desc;
        themeToggle.title = t.nav_theme_desc;
        
        // Update flag (show the flag of the language we can switch TO)
        langIcon.textContent = lang === 'es' ? '🇬🇧' : '🇪🇸';
        
        // Update router content
        if (typeof router === 'function') {
            router();
        }
    };

    // Load saved language
    let currentLang = localStorage.getItem('lang') || 'es';
    updateLanguage(currentLang);

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('lang', currentLang);
        updateLanguage(currentLang);
    });

    // Logging for "Technical detail"
    console.log('%cMario Minuesa Portfolio %cLoaded with details.', 'color: #0d6efd; font-weight: bold; font-size: 1.2rem', 'color: inherit');
});
