// script.js
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

    // --- Карусель ---
    const images = [
        './static/images/1.png',
        './static/images/2.png',
        './static/images/3.png'
    ];
    let currentSlide = 0;
    const slideElement = document.getElementById('carouselSlide');
    const indicators = document.querySelectorAll('.carousel__indicator');

    function updateCarousel(index) {
        slideElement.style.backgroundImage = `url(${images[index]})`;
        indicators.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('carousel__indicator--active');
            } else {
                dot.classList.remove('carousel__indicator--active');
            }
        });
    }

    document.getElementById('arrleft').addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + images.length) % images.length;
        updateCarousel(currentSlide);
    });

    document.getElementById('arrright').addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % images.length;
        updateCarousel(currentSlide);
    });

    indicators.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel(currentSlide);
        });
    });

    setInterval(() => {
        currentSlide = (currentSlide + 1) % images.length;
        updateCarousel(currentSlide);
    }, 5000);

    updateCarousel(0);

    // --- Клик по карточкам товаров ---
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const brand = this.querySelector('.product-card__brand').textContent;
            const name = this.querySelector('.product-card__name').textContent;
            alert(`Товар: ${brand} — ${name}`);
        });
    });

    // --- Клик по кнопке "СМОТРЕТЬ ВСЕ" ---
    document.getElementById('watchAllBtn').addEventListener('click', function() {
        alert('Открытие каталога...');
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

    // --- Выделение пунктов меню (прямоугольник) с учётом масштаба ---
    const highlightRect = document.getElementById('highlightRect');
    const menuItems = document.querySelectorAll('.menu__item');

    function moveHighlight(targetItem) {
        if (!targetItem || !menuDefault) return;

        // Получаем клиентские прямоугольники
        const menuRect = menuDefault.getBoundingClientRect();
        const itemRect = targetItem.getBoundingClientRect();

        // Вычисляем смещение относительно меню в пикселях на экране,
        // затем делим на текущий масштаб, чтобы получить координаты в исходной системе (до масштабирования)
        const left = (itemRect.left - menuRect.left) / currentScale;
        const top = (itemRect.top - menuRect.top) / currentScale;
        const width = itemRect.width / currentScale;

        // Применяем позиционирование (добавляем отступы для красивого внешнего вида)
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