document.addEventListener('DOMContentLoaded', function() {
    const home = document.querySelector('.home');
    let currentScale = 1;

    // --- Масштабирование .home на всю ширину окна ---
    function scaleHome() {
        if (!home) return;
        const windowWidth = window.innerWidth;
        const originalWidth = 1440;
        let scale = windowWidth / originalWidth;
        if (scale < 1) scale = 1;
        currentScale = scale;
        home.style.transform = `scale(${scale})`;
        home.style.transformOrigin = 'top left';
    }

    scaleHome();
    window.addEventListener('resize', function() {
        scaleHome();
        const activeItem = document.querySelector('.menu__item[data-menu="novelties"]') ||
                           document.querySelector('.menu__item--active');
        if (activeItem) moveHighlight(activeItem);
    });

    // --- Меню и выпадающие списки ---
    const menuDefault = document.getElementById('menuDefault');
    const dropdownDesigners = document.getElementById('dropdownDesigners');
    const dropdownNovelties = document.getElementById('dropdownNovelties');
    const sideButton = document.getElementById('sideButton');

    function hideAllDropdowns() {
        dropdownDesigners.style.display = 'none';
        dropdownNovelties.style.display = 'none';
        menuDefault.style.display = 'flex';
        sideButton.classList.remove('side-button--novelties');
    }

    document.querySelectorAll('.menu__item[data-menu]').forEach(item => {
        item.addEventListener('click', (e) => {
            const menuType = e.target.dataset.menu;
            hideAllDropdowns();
            if (menuType === 'designers') {
                dropdownDesigners.style.display = 'block';
                menuDefault.style.display = 'none';
            } else if (menuType === 'novelties') {
                dropdownNovelties.style.display = 'block';
                menuDefault.style.display = 'none';
                sideButton.classList.add('side-button--novelties');
            }
        });
    });

    document.querySelectorAll('.menu__item:not([data-menu])').forEach(item => {
        item.addEventListener('click', hideAllDropdowns);
    });

    dropdownDesigners.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN') hideAllDropdowns();
    });

    dropdownNovelties.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN' && !e.target.classList.contains('search-block__placeholder')) {
            hideAllDropdowns();
        }
    });

    // --- Выделение пунктов меню (прямоугольник) с учётом масштаба ---
    const highlightRect = document.getElementById('highlightRect');
    const menuItems = document.querySelectorAll('.menu__item');

    function moveHighlight(targetItem) {
        if (!targetItem || !menuDefault) return;
        const menuRect = menuDefault.getBoundingClientRect();
        const itemRect = targetItem.getBoundingClientRect();
        const left = (itemRect.left - menuRect.left) / currentScale;
        const top = (itemRect.top - menuRect.top) / currentScale;
        const width = itemRect.width / currentScale;
        highlightRect.style.left = (left - 10) + 'px';
        highlightRect.style.top = (top - 8) + 'px';
        highlightRect.style.width = (width + 20) + 'px';
    }

    setTimeout(() => {
        const defaultActive = document.querySelector('.menu__item[data-menu="novelties"]');
        if (defaultActive) moveHighlight(defaultActive);
    }, 100);

    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            moveHighlight(this);
        });
    });

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            moveHighlight(this);
        });
    });

    document.querySelectorAll('.menu__item[data-menu]').forEach(item => {
        item.addEventListener('click', function() {
            setTimeout(() => moveHighlight(this), 50);
        });
    });

    // --- Логика Аккордеона (Вопросы/Ответы) ---
    const faqHeaders = document.querySelectorAll('.faq-header');
    
    faqHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            if (!faqItem) return;

            // Проверяем, открыт ли текущий элемент
            const isActive = faqItem.classList.contains('active');

            // Если нужно закрыть остальные при открытии одного (как в некоторых дизайнах), раскомментируйте код ниже:
            /*
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            */

            // Переключаем состояние
            if (isActive) {
                faqItem.classList.remove('active');
            } else {
                faqItem.classList.add('active');
            }
        });
    });

    // --- Клик по элементам меню (для демонстрации) ---
    document.querySelectorAll('.menu__item, .menu-dropdown__item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.dataset.menu) return;
            e.preventDefault();
            alert(`Переход в раздел: ${this.textContent.trim()}`);
        });
    });

    // --- Клик по ссылкам в футере ---
    document.querySelectorAll('.social-block__link, .info-block__link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert(`Открытие страницы: ${this.textContent}`);
        });
    });
});