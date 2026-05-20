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
        // После изменения масштаба обновляем позицию подсветки для активного пункта
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

    // --- ЛОГИКА ДЛЯ АЛФАВИТА ---
    const letters = document.querySelectorAll('.alphabet-nav .letter');
    letters.forEach(letter => {
        letter.addEventListener('click', function() {
            letters.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // --- Клик по элементам меню (для демонстрации) ---
    document.querySelectorAll('.menu__item, .menu-dropdown__item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.dataset.menu) return;
            e.preventDefault();
            // Здесь можно добавить реальную навигацию
            console.log(`Переход в раздел: ${this.textContent.trim()}`);
        });
    });

    // --- Клик по ссылкам в футере ---
    document.querySelectorAll('.social-block__link, .info-block__link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Открытие страницы: ${this.textContent}`);
        });
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

    // Устанавливаем начальную подсветку на "НОВИНКИ"
    setTimeout(() => {
        const defaultActive = document.querySelector('.menu__item[data-menu="novelties"]');
        if (defaultActive) moveHighlight(defaultActive);
    }, 100);

    // Наведение мышью — перемещаем подсветку
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            moveHighlight(this);
        });
    });

    // Клик — также перемещаем подсветку и оставляем её на выбранном пункте
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            moveHighlight(this);
        });
    });

    // Дополнительная синхронизация при открытии выпадающих меню
    document.querySelectorAll('.menu__item[data-menu]').forEach(item => {
        item.addEventListener('click', function() {
            setTimeout(() => moveHighlight(this), 50);
        });
    });
});