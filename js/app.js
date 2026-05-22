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

    // Login & JWT Logic
    const loginBtn = document.getElementById('loginBtn');
    const loginModalEl = document.getElementById('loginModal');
    const loginModal = loginModalEl ? new bootstrap.Modal(loginModalEl) : null;
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    const updateLoginState = () => {
        const token = localStorage.getItem('token');
        if (token) {
            loginBtn.innerHTML = '<i class="bi bi-box-arrow-right me-1"></i>Logout';
            loginBtn.classList.replace('btn-outline-primary', 'btn-outline-danger');
            
            // Add Admin link if it doesn't exist
            if (!document.getElementById('adminNavLink')) {
                const navItem = document.createElement('li');
                navItem.className = 'nav-item';
                navItem.innerHTML = '<a class="nav-link text-warning fw-bold" href="#/admin" data-route="/admin" id="adminNavLink"><i class="bi bi-shield-lock me-1"></i>Admin</a>';
                document.querySelector('.navbar-nav').insertBefore(navItem, loginBtn.parentElement);
            }
        } else {
            loginBtn.innerHTML = '<i class="bi bi-person-lock me-1"></i>Login';
            loginBtn.classList.replace('btn-outline-danger', 'btn-outline-primary');
            const adminLink = document.getElementById('adminNavLink');
            if (adminLink) adminLink.parentElement.remove();
        }
    };

    updateLoginState();

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const token = localStorage.getItem('token');
            if (token) {
                // Logout
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                updateLoginState();
                location.hash = '/'; // Go home
            } else {
                if (loginModal) loginModal.show();
            }
        });
    }

    if (loginForm) {
        const loginSubmitBtn = loginForm.querySelector('button[type="submit"]');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUser').value.trim();
            const password = document.getElementById('loginPass').value;

            loginError.classList.add('d-none');
            if (loginSubmitBtn) {
                loginSubmitBtn.disabled = true;
                loginSubmitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Entrando...';
            }

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);
                    loginModal.hide();
                    loginForm.reset();
                    updateLoginState();
                    if (location.hash === '#/admin') {
                        router();
                    } else {
                        location.hash = '/admin';
                    }
                } else {
                    loginError.textContent = data.message;
                    loginError.classList.remove('d-none');
                }
            } catch (err) {
                loginError.textContent = 'Error de conexión con el servidor.';
                loginError.classList.remove('d-none');
            } finally {
                if (loginSubmitBtn) {
                    loginSubmitBtn.disabled = false;
                    loginSubmitBtn.innerHTML = 'Iniciar Sesión';
                }
            }
        });
    }

    console.log('%cMario Minuesa Portfolio', 'color:#0d6efd;font-weight:bold;font-size:1.2rem');
});
