document.addEventListener('DOMContentLoaded', () => {
    // Мобильное меню
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('toggle');
            
            // Анимация линий бургера
            const lines = burger.querySelectorAll('div');
            if (nav.classList.contains('active')) {
                lines[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    }

    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                if (burger) {
                    const lines = burger.querySelectorAll('div');
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                    burger.classList.remove('toggle');
                }
            }
        });
    });

    // Плавная прокрутка к секциям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Учитываем высоту header
                window.scrollTo({
                    top: offsetTop,                    behavior: 'smooth'
                });
            }
        });
    });

    // Анимация появления секций при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Анимация только один раз
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Эффект для header при скролле
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        }
        
        lastScroll = currentScroll;
    });

    // Плавное появление элементов меню
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-20px)';
        link.style.transition = `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';        }, 300 + (index * 100));
    });

    // Анимация для кнопок меню
    const buttons = document.querySelectorAll('.btn, .menu-item');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Console log для отладки (можно удалить)
    console.log('☕ Кофейня Зерно — сайт загружен');
    console.log('📍 Контакты: ул. Примерная, д. 123');
    console.log('📞 Телефон: +7 (999) 123-45-67');
});

// Функция для плавного появления элементов
function fadeInElement(element, duration = 600) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;
    
    setTimeout(() => {
        element.style.opacity = '1';
    }, 100);
}

// Экспорт функций (если нужно использовать в других скриптах)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fadeInElement };
}