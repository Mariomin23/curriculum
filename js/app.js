document.addEventListener('DOMContentLoaded', () => {
    // Theme
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');

    const updateIcons = (theme) => {
        sunIcon.classList.toggle('d-none', theme !== 'dark');
        moonIcon.classList.toggle('d-none', theme === 'dark');
    };

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-bs-theme', savedTheme);
    updateIcons(savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcons(newTheme);
    });

    // Language
    const langToggle = document.getElementById('langToggle');
    const langIcon = document.getElementById('langIcon');
    let currentLang = localStorage.getItem('lang') || 'es';

    const updateLanguage = (lang) => {
        const t = translations[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.innerHTML = t[key];
        });
        langToggle.title = t.nav_lang_desc;
        themeToggle.title = t.nav_theme_desc;
        langIcon.textContent = lang === 'es' ? '🇬🇧' : '🇪🇸';
        if (typeof router === 'function') router();
    };

    updateLanguage(currentLang);

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('lang', currentLang);
        updateLanguage(currentLang);
    });

    // Login button — coming soon toast
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const t = translations[currentLang];
            const toastEl = document.getElementById('loginToast');
            document.getElementById('loginToastTitle').textContent = t.login_toast_title;
            document.getElementById('loginToastBody').textContent = t.login_toast_body;
            bootstrap.Toast.getOrCreateInstance(toastEl).show();
        });
    }

    console.log('%cMario Minuesa Portfolio', 'color:#0d6efd;font-weight:bold;font-size:1.2rem');
});
