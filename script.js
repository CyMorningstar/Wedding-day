// --- КОНФИГУРАЦИЯ ---
const decorativeImages = document.querySelectorAll('.decorative-image');
const preloaderContentWrapper = document.querySelector('.preloader-content-wrapper');
const weddingDateString = "2026-06-12 12:00:00";
const backgroundVideoSrc = "Particles_2_29s_2kres.mp4";
const loveSong = new Audio('musicLove.mp3');
const telegramChannelLink = "https://web.telegram.org/k/#@haremolchat";
// --- КОНЕЦ КОНФИГУРАЦИИ ---

// Получаем элементы DOM
const preloader = document.getElementById('preloader');
const backgroundVideo = document.getElementById('preloader-video');
const backgroundVideo2 = document.getElementById('main-video');
const audioControls = document.getElementById('audio-controls');
const playPauseButton = document.getElementById('play-pause-button');
const mainContent = document.querySelector('.main-content');
const telegramLinkElement = document.getElementById('telegram-link');

// Элементы для слайдера разблокировки
const slider = document.getElementById('slider');
    const sliderTrackContainer = document.querySelector('.slider-track-container');
    // Проверяем, существует ли sliderTrackContainer
    const endCircle = sliderTrackContainer ? sliderTrackContainer.querySelector('.end-circle') : null;

let isMusicPlaying = false;
let countdownInterval;

let sliderProgress;
    if (sliderTrackContainer) { // Создаем только если контейнер трека существует
        if (!document.querySelector('.slider-progress')) {
            sliderProgress = document.createElement('div');
            sliderProgress.classList.add('slider-progress');
            sliderTrackContainer.insertBefore(sliderProgress, endCircle);
        } else {
            sliderProgress = document.querySelector('.slider-progress');
        }
    } else {
        // Если sliderTrackContainer не существует, то и ползунка нет
        console.warn("Slider track container not found. Slider functionality will be disabled.");
        sliderProgress = null; // Устанавливаем в null, если нет контейнера
    }

let isDraggingSlider = false;
let isDraggingEndCircle = false;
let initialX;
let currentSliderX = 0;
let currentEndCircleX = 0;

let sliderUnlockPoint = 0;
let endCircleMaxMove = 0;

    function getClientX(event) {
        // Возвращает X-координату для событий мыши и касаний
        if (event.touches && event.touches.length > 0) {
            return event.touches[0].clientX;
        }
        return event.clientX;
    }

    function startDrag(event, element, type) {
        if (type === 'slider') {
            isDraggingSlider = true;
            slider.classList.add('dragging');
        } else if (type === 'endCircle' && endCircle) {
            isDraggingEndCircle = true;
            endCircle.classList.add('grabbing');
        }
        initialX = getClientX(event);
        // Предотвращаем стандартное поведение браузера (например, выделение текста)
        event.preventDefault();
    }  

    function drag(event) {
        if (!isDraggingSlider && !isDraggingEndCircle) return;

        const clientX = getClientX(event);
        const deltaX = clientX - initialX;
        let newPos;

        if (isDraggingSlider) {
            newPos = currentSliderX + deltaX;
            // Ограничиваем движение ползунка
            if (newPos < 0) newPos = 0;
            if (newPos > sliderTrackContainer.offsetWidth - slider.offsetWidth) newPos = sliderTrackContainer.offsetWidth - slider.offsetWidth;

            slider.style.left = `${newPos}px`;
            currentSliderX = newPos;

            // Обновляем прогресс-полосу
            if (sliderProgress) {
                const progressWidth = (currentSliderX / (sliderTrackContainer.offsetWidth - slider.offsetWidth)) * 100;
                sliderProgress.style.width = `${progressWidth}%`;
            }

            // Проверяем, достиг ли ползунок точки разблокировки
            if (currentSliderX >= sliderUnlockPoint) {
                unlockContent();
            }

        } else if (isDraggingEndCircle && endCircle) {
            newPos = currentEndCircleX + deltaX;
            // Ограничиваем движение конечного круга
            if (newPos < 0) newPos = 0;
            if (newPos > endCircleMaxMove) newPos = endCircleMaxMove;

            endCircle.style.left = `${newPos}px`;
            currentEndCircleX = newPos;
        }
        // Обновляем initialX для следующего движения
        initialX = clientX;
    }

    function stopDrag() {
        if (isDraggingSlider) {
            isDraggingSlider = false;
            slider.classList.remove('dragging');
            // Если ползунок не доехал до конца, возвращаем его на место
            if (currentSliderX < sliderUnlockPoint) {
                currentSliderX = 0;
                slider.style.left = `${currentSliderX}px`;
                if (sliderProgress) sliderProgress.style.width = '0%';
            }
        }
        if (isDraggingEndCircle && endCircle) {
            isDraggingEndCircle = false;
            endCircle.classList.remove('grabbing');
        }
    }

    // --- Инициализация ползунков ---
    function initializeSlider() {
        if (!sliderTrackContainer || !slider || !endCircle) {
            console.warn("Не удалось инициализировать слайдер: отсутствуют необходимые элементы.");
            return; // Выходим, если нет контейнера трека
        }

        // Рассчитываем позиции после загрузки или изменения размера
        sliderUnlockPoint = sliderTrackContainer.offsetWidth / 2 - slider.offsetWidth / 2;
        endCircleMaxMove = sliderTrackContainer.offsetWidth - endCircle.offsetWidth;

        currentSliderX = 0;
        slider.style.left = `${currentSliderX}px`;
        if (sliderProgress) sliderProgress.style.width = '0%';

        currentEndCircleX = sliderTrackContainer.offsetWidth - endCircle.offsetWidth;
        endCircle.style.left = `${currentEndCircleX}px`;
    }

    if (slider) slider.addEventListener('mousedown', (e) => startDrag(e, slider, 'slider'));
    if (endCircle) endCircle.addEventListener('mousedown', (e) => startDrag(e, endCircle, 'endCircle'));
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    if (slider) slider.addEventListener('touchstart', (e) => startDrag(e, slider, 'slider'));
    if (endCircle) endCircle.addEventListener('touchstart', (e) => startDrag(e, endCircle, 'endCircle'));
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDrag);

    function setPreloaderContentPosition() {
        if (window.innerWidth <= 768) {
            preloaderContentWrapper.classList.remove('center-on-desktop');
            preloaderContentWrapper.style.position = 'absolute';
            preloaderContentWrapper.style.bottom = '20px';
            preloaderContentWrapper.style.top = 'auto';
        } else {
            preloaderContentWrapper.classList.add('center-on-desktop');
            preloaderContentWrapper.style.position = 'absolute';
            preloaderContentWrapper.style.bottom = 'auto';
            preloaderContentWrapper.style.top = '50%';
        }
        initializeSlider(); // Пересчитываем позиции ползунков после изменения размера
    }

    function unlockContent() {
        console.log("Разблокировка выполнена!");    
        preloader.style.opacity = '0';
        mainContent.style.opacity = '1';
        backgroundVideo.pause();
        backgroundVideo.currentTime = 0;

        
        setTimeout(() => {
            preloader.style.display = 'none';
            mainContent.style.display = 'visible';
            showDecorativeImages();
            audioControls.classList.add('visible');
            document.body.style.overflowY = 'auto';
        }, 1000);
            
            
        if (!isMusicPlaying) {
        loveSong.play().catch(error => console.log("Воспроизведение музыки:", error));
        isMusicPlaying = true;
        playPauseButton.classList.remove('fa-play');
        playPauseButton.classList.add('fa-pause');
        }

    }

    function showDecorativeImages() {
            decorativeImages.forEach((img, index) => {
                setTimeout(() => {
                    img.classList.add('visible');
                }, index * 300);
            });
        }

        function updateCountdown() {
        const weddingDate = new Date(weddingDateString).getTime();
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown').innerHTML = "<h3>Счастливы быть вместе!</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days < 10 ? "0" + days : days;
        document.getElementById("hours").textContent = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").textContent = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").textContent = seconds < 10 ? "0" + seconds : seconds;
    }   

    // --- Инициализация при загрузке DOM ---

document.addEventListener('DOMContentLoaded', function() {



    playPauseButton.addEventListener('click', () => {
        if (isMusicPlaying) {
            loveSong.pause();
            playPauseButton.classList.remove('fa-pause');
            playPauseButton.classList.add('fa-play');
        } else {
            loveSong.play().catch(error => console.log("Воспроизведение музыки:", error));
            playPauseButton.classList.remove('fa-play');
            playPauseButton.classList.add('fa-pause');
        }
        isMusicPlaying = !isMusicPlaying;
    });
    loveSong.onerror = () => {
        console.error("Ошибка загрузки аудиофайла:", loveSong.src);
        audioControls.style.display = 'none';
        alert(`Ошибка загрузки аудиофайла: ${loveSong.src}. Проверьте путь и файл!`);
    };

    // 4. Таймер обратного отсчета
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);

    // 5. Ссылка на телеграм
    telegramLinkElement.href = telegramChannelLink;

    // Изначально скрываем основной контент и отключаем прокрутку
    document.body.style.overflowY = 'hidden';

});

