        const upgradeTrigger = document.getElementById('trigger-upgrade');
        const upgradeScreen = document.createElement('div');
        upgradeScreen.id = 'windows-upgrade-screen';

        upgradeScreen.innerHTML = `
            <div class="win-spinner"></div>
            <div class="win-text-large">Configuring updates.</div>
            <div class="win-text-small"><span id="win-progress">0</span>% complete</div>
            <div class="win-text-small">Do not turn off your device.</div>
            <div class="win-snarky">You didn't need to be productive today, right?</div>
        `;
        document.body.appendChild(upgradeScreen);

        const progressEl = upgradeScreen.querySelector('#win-progress');
        let upgradeActive = false;
        let upgradeInterval;
        let progress = 0;

        upgradeTrigger.addEventListener('click', () => {
            if (upgradeActive) return;
            upgradeActive = true;
            trackEasterEgg('upgrade');
            progress = 0;
            progressEl.innerText = progress;
            upgradeScreen.classList.add('active');

            if (typeof Sfx !== 'undefined' && Sfx.play) {
                Sfx.init();
                Sfx.play('transition');
            }

            // Simulate progress
            upgradeInterval = setInterval(() => {
                // Random jump in progress
                progress += Math.floor(Math.random() * 5);
                if (progress > 99) progress = 99; // Hang at 99% for realism
                progressEl.innerText = progress;
            }, 800);
        });

        // Click anywhere to dismiss (an escape hatch)
        upgradeScreen.addEventListener('click', () => {
            if (!upgradeActive) return;
            clearInterval(upgradeInterval);
            upgradeScreen.classList.remove('active');

            if (typeof Sfx !== 'undefined' && Sfx.play) {
                Sfx.play('achievement'); // A little ping to confirm escape
            }

            setTimeout(() => {
                upgradeActive = false;
            }, 500);
        });
