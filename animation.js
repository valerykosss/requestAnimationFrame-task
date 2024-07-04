document.addEventListener("DOMContentLoaded", () => {
    const subheader = document.querySelector(".banner__subheader");
    const header = document.querySelector(".banner__header");
    const image1 = document.querySelector(".banner__image-1");
    const image2 = document.querySelector(".banner__image-2");
    const image3 = document.querySelector(".banner__image-3");
    const image4 = document.querySelector(".banner__image-4");

    // для subheader
    const subheaderStartTop = -100;
    const subheaderStartScale = 0.7;
    const subheaderTargetTop = 51.30;
    const subheaderTargetScale = 1; 
    const animationDuration = 600;
    const delay = 10;

    // для header
    const headerStartLeft = -200;
    const headerTargetLeft = 59.02;
    const headerAnimationDuration = 300;

    // массив для изображений
    const images = [
        { element: image1, startRotation: -12.76, targetRotation: -57.76 },
        { element: image2, startRotation: 6.43, targetRotation: 51.43 },
        { element: image3, startRotation: 0, targetRotation: -45 },
        { element: image4, startRotation: 0, targetRotation: 45 }
    ];

    const imageRotationDuration = 500;
    const imagePauseDuration = 150; // пауза в мс

    let startTime = null;

    function animate(time) {
        if (!startTime) 
            startTime = time;

        const elapsedTime = time - startTime;

        if (elapsedTime < animationDuration) {
            // перемещение subheader
            const easing = (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease-in-out
            const easedTime = easing(elapsedTime / animationDuration);
            const currentTop = subheaderStartTop + easedTime * (subheaderTargetTop - subheaderStartTop);
            subheader.style.top = `${currentTop}px`;
            requestAnimationFrame(animate);
        } else if (elapsedTime < animationDuration + delay) {
            // задержка перед масштабом
            requestAnimationFrame(animate);
        } else {
            // масштаб subheader
            const scaleTime = elapsedTime - animationDuration - delay;
            const scaleDuration = 400;

            if (scaleTime < scaleDuration) {
                const easing = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                const easedTime = easing(scaleTime / scaleDuration);
                const currentScale = subheaderStartScale + easedTime * (subheaderTargetScale - subheaderStartScale);
                subheader.style.transform = `scale(${currentScale})`;
                requestAnimationFrame(animate);
            } else {
                subheader.style.transform = `scale(${subheaderTargetScale})`;

                // запуск анимации header после завершения анимации subheader
                startTime = null;
                requestAnimationFrame(() => {
                    animateHeader(performance.now()); // начать анимацию header
                    animateImageTarget(performance.now()); // начать анимацию image1
                });
            }
        }
    }

    function animateHeader(time) {
        if (!startTime) 
            startTime = time;

        const elapsedTime = time - startTime;

        if (elapsedTime < headerAnimationDuration) {
            const easing = (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease-in-out
            const easedTime = easing(elapsedTime / headerAnimationDuration);
            const currentLeft = headerStartLeft + easedTime * (headerTargetLeft - headerStartLeft);
            header.style.left = `${currentLeft}px`;

            // анимация вращения для всех изображений
            images.forEach(({ element, startRotation, targetRotation }) => {
                const currentRotation = startRotation + easedTime * (targetRotation - startRotation);
                element.style.transform = `rotate(${currentRotation}deg)`;
            });

            requestAnimationFrame(animateHeader);
        } else {
            header.style.left = `${headerTargetLeft}px`;

            // установка конечного вращения для всех изображений
            images.forEach(({ element, targetRotation }) => {
                element.style.transform = `rotate(${targetRotation}deg)`;
            });
        }
    }

    function animateImageTarget(time) {
        if (!startTime) 
            startTime = time;

        const elapsedTime = time - startTime;

        if (elapsedTime < imageRotationDuration) {
            const easing = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            const easedTime = easing(elapsedTime / imageRotationDuration);

            // анимация вращения для всех изображений
            images.forEach(({ element, startRotation, targetRotation }) => {
                const currentRotation = startRotation + easedTime * (targetRotation - startRotation);
                element.style.transform = `rotate(${currentRotation}deg)`;
            });

            requestAnimationFrame(() => animateImageTarget(performance.now()));
        } else {
            // установка конечного вращения для всех изображений
            images.forEach(({ element, targetRotation }) => {
                element.style.transform = `rotate(${targetRotation}deg)`;
            });

            // Пауза перед возвратом вращения image1
            setTimeout(() => {
                requestAnimationFrame(() => animateImageReturn(performance.now()));
            }, imagePauseDuration);

            startTime = null; // Сброс времени после завершения animateImageTarget
        }
    }

    function animateImageReturn(time) {
        if (!startTime) 
            startTime = time;

        const elapsedTime = time - startTime;

        if (elapsedTime < imageRotationDuration) {
            const easing = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            const easedTime = easing(elapsedTime / imageRotationDuration);

            // возврат вращения для всех изображений
            images.forEach(({ element, startRotation, targetRotation }) => {
                const currentRotation = targetRotation + easedTime * (startRotation - targetRotation);
                element.style.transform = `rotate(${currentRotation}deg)`;
            });

            requestAnimationFrame(() => animateImageReturn(performance.now()));
        } else {
            // установка исходного вращения для всех изображений
            images.forEach(({ element, startRotation }) => {
                element.style.transform = `rotate(${startRotation}deg)`;
            });

            startTime = null; // Сброс времени после завершения animateImageReturn
        }
    }

    requestAnimationFrame(animate);
});
