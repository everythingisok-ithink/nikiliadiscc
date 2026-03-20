        const freezeTrigger = document.getElementById('trigger-freeze');

        // Setup freeze overlay
        const freezeOverlay = document.createElement('div');
        freezeOverlay.id = 'freeze-overlay';

        document.body.appendChild(freezeOverlay);

        let isFrozen = false;
        let frostTimer;

        freezeTrigger.addEventListener('click', () => {
            if (isFrozen) return;
            isFrozen = true;
            trackEasterEgg('freeze');

            if (typeof Sfx !== 'undefined' && Sfx.play) {
                Sfx.init();
                Sfx.play('transition'); // Makes a nice whoosh sound for freezing
            }

            freezeOverlay.classList.add('frozen');

            // Auto unfreeze after 3 seconds
            frostTimer = setTimeout(unfreeze, 3000);

            document.addEventListener('mousemove', handleFrostScrape);
        });

        function handleFrostScrape(e) {
            if (!isFrozen) return;
            freezeOverlay.style.setProperty('--mouse-x', e.clientX + 'px');
            freezeOverlay.style.setProperty('--mouse-y', e.clientY + 'px');
        }

        function unfreeze() {
            isFrozen = false;
            freezeOverlay.classList.remove('frozen');
            document.removeEventListener('mousemove', handleFrostScrape);
            clearTimeout(frostTimer);
        }

        // Clicking the overlay itself unfreezes it faster
        freezeOverlay.addEventListener('click', unfreeze);

