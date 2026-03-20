        document.querySelectorAll('.cd-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                trackEasterEgg('cd');
                const cdSvg = `
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                    <circle cx="50" cy="50" r="20" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                    <circle cx="50" cy="50" r="10" fill="transparent" stroke="#cbd5e1" stroke-width="1"/>
                    <circle cx="50" cy="50" r="6" fill="#0f172a" />
                    <!-- Rainbow gradient effect lines representing reflections -->
                    <path d="M 50 5 L 65 30" stroke="rgba(236, 72, 153, 0.5)" stroke-width="2" />
                    <path d="M 50 95 L 35 70" stroke="rgba(56, 189, 248, 0.5)" stroke-width="2" />
                </svg>`;

                const cd = document.createElement('div');
                cd.className = 'cd-animation';
                cd.innerHTML = cdSvg;

                // Position at click coordinates
                cd.style.left = e.clientX + 'px';
                cd.style.top = e.clientY + 'px';

                document.body.appendChild(cd);

                // Play a brief sound if Sfx system is available
                if (typeof Sfx !== 'undefined' && Sfx.play) {
                    Sfx.init();
                    // Play a quick high ping for the CD
                    Sfx.play('achievement');
                }

                // Remove when animation finishes
                cd.addEventListener('animationend', () => {
                    cd.remove();
                });
            });
        });
