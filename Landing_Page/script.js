// ===== Theme Manager =====
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = this.prefersDarkScheme.matches ? 'dark' : 'light';
        const currentTheme = savedTheme || systemTheme;
        
        this.applyTheme(currentTheme);
        this.bindEvents();
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            this.themeIcon.className = 'fas fa-sun';
        } else {
            document.body.classList.remove('dark-mode');
            this.themeIcon.className = 'fas fa-moon';
        }
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            const theme = isDark ? 'dark' : 'light';
            
            localStorage.setItem('theme', theme);
            this.themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            
            this.themeToggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.themeToggle.style.transform = 'scale(1)';
            }, 150);
        });

        this.prefersDarkScheme.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// ===== Smooth Scroller =====
class SmoothScroller {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== Animation Observer =====
class AnimationObserver {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.init();
    }

    init() {
        document.querySelectorAll('.fade-in').forEach(element => {
            this.observer.observe(element);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                this.observer.unobserve(entry.target);
            }
        });
    }
}


// ===== Mobile Menu =====
class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileMenuToggle');
        this.navLinks = document.querySelector('.nav-links');
        this.bindEvents();
    }

    bindEvents() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => {
                console.log('Mobile menu toggle clicked');
            });
        }
    }
}

// ===== Performance Monitor =====
class PerformanceMonitor {
    constructor() {
        this.monitorPageLoad();
    }

    monitorPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${Math.round(loadTime)}ms`);
            
            if (loadTime > 3000) {
                console.warn('Page load time is slow');
            }
        });
    }
}

// ===== Accessibility Manager =====
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.addKeyboardNavigation();
        this.addFocusIndicators();
        this.addARIALabels();
    }

    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    addFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid var(--primary) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    }

    addARIALabels() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Toggle dark/light mode');
        }

        document.querySelectorAll('.feature-card').forEach(card => {
            card.setAttribute('role', 'article');
        });
    }
}

// ===== Initialize All =====
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new SmoothScroller();
    new AnimationObserver();
    new ButtonManager();
    new MobileMenu();
    new PerformanceMonitor();
    new AccessibilityManager();
    
    console.log('🚀 TryCodeEditor landing page initialized successfully!');
});

// ===== Error Handling =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// ===== Easter Egg =====
console.log(`
🎉 Welcome to TryCodeEditor! 

Built with ❤️ for developers by developers.

Tech Stack:
- Vanilla JavaScript (ES6+)
- CSS3 with Custom Properties
- Responsive Design
- Accessibility First
- Performance Optimized

Want to contribute? We'd love your help!
`);
