        const pressureTrigger = document.getElementById('trigger-pressure');
        let pressureActive = false;

        pressureTrigger.addEventListener('click', () => {
            if (pressureActive) return;
            pressureActive = true;
            trackEasterEgg('pressure');

            if (typeof Sfx !== 'undefined' && Sfx.play) {
                Sfx.init();
                Sfx.play('transition');
            }

            document.body.classList.add('pressure-squeeze');

            setTimeout(() => {
                document.body.classList.remove('pressure-squeeze');
                if (typeof Sfx !== 'undefined' && Sfx.play) {
                    Sfx.play('transition');
                }
                setTimeout(() => { pressureActive = false; }, 1000); // Cooldown
            }, 1000);
        });
