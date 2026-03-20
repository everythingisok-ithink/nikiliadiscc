        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
        let konamiIndex = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    konamiIndex = 0;
                    document.body.classList.toggle('win95-theme');
                    const isActive = document.body.classList.contains('win95-theme');

                    if (isActive) {
                        trackEasterEgg('konami');
                        if (typeof Sfx !== 'undefined' && Sfx.play) {
                            Sfx.init();
                            Sfx.play('achievement');
                        }
                    }
                }
            } else {
                konamiIndex = 0; // Reset if sequence is broken
            }
        });

        // Touch support for Konami Mobile
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const x = touch.clientX;
            const y = touch.clientY;
            let key = '';

            const w = window.innerWidth;
            const h = window.innerHeight;

            if (y < h / 3) key = 'ArrowUp';
            else if (y > (h * 2) / 3) key = 'ArrowDown';
            else if (x < w / 3) key = 'ArrowLeft';
            else if (x > (w * 2) / 3) key = 'ArrowRight';

            if (key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    konamiIndex = 0;
                    document.body.classList.toggle('win95-theme');
                    const isActive = document.body.classList.contains('win95-theme');

                    if (isActive) {
                        trackEasterEgg('konami');
                        if (typeof Sfx !== 'undefined' && Sfx.play) {
                            Sfx.init();
                            Sfx.play('achievement');
                        }
                    }
                }
            } else {
                konamiIndex = 0;
            }
        }, { passive: true });

        // Make the Win95 close buttons dynamically revert the theme
        document.querySelectorAll('.win95-close').forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.classList.remove('win95-theme');
                konamiIndex = 0;
            });
        });
