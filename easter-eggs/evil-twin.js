        const evilProfileImgFallback = document.getElementById('profile-container');
        let evilPressTimer;
        let isEvilActive = false;

        const toggleEvilTwin = () => {
            isEvilActive = !isEvilActive;
            document.body.classList.toggle('evil-twin-theme', isEvilActive);

            document.querySelectorAll('.good-twin').forEach(el => el.classList.toggle('hidden', isEvilActive));
            document.querySelectorAll('.evil-twin').forEach(el => el.classList.toggle('hidden', !isEvilActive));

            document.title = isEvilActive ? "Not Nik Iliadis" : "Nik Iliadis";

            if (isEvilActive) {
                trackEasterEgg('eviltwin');
                if (typeof Sfx !== 'undefined' && Sfx.play) {
                    try {
                        Sfx.init();
                        Sfx.play('achievement');
                    } catch (e) { }
                }
            }
        };

        const startEvilPress = (e) => {
            if (e.type === 'mousedown' && e.button !== 0) return;
            evilPressTimer = setTimeout(() => {
                toggleEvilTwin();
            }, 1000);
        };

        const cancelEvilPress = () => {
            clearTimeout(evilPressTimer);
        };

        if (evilProfileImgFallback) {
            evilProfileImgFallback.addEventListener('mousedown', startEvilPress);
            evilProfileImgFallback.addEventListener('touchstart', startEvilPress, { passive: true });

            evilProfileImgFallback.addEventListener('mouseup', cancelEvilPress);
            evilProfileImgFallback.addEventListener('mouseleave', cancelEvilPress);
            evilProfileImgFallback.addEventListener('touchend', cancelEvilPress);
            evilProfileImgFallback.addEventListener('touchcancel', cancelEvilPress);

            evilProfileImgFallback.addEventListener('contextmenu', (e) => {
                // Prevent context menu to not interrupt long press on mobile
                e.preventDefault();
            });
        }
