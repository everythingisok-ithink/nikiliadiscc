        const TOTAL_EGGS = 14;
        const desktopCounter = document.getElementById('egg-counter-desktop');
        const mobileCounter = document.getElementById('egg-counter-mobile');

        function updateCounterUI() {
            let foundEggs = [];
            try {
                foundEggs = JSON.parse(localStorage.getItem('foundEasterEggs') || '[]');
            } catch (e) {
                console.error('Failed to parse easter egg data', e);
            }

            const count = foundEggs.length;
            const text = `Secrets found ${count}/${TOTAL_EGGS}`;

            if (desktopCounter) desktopCounter.innerText = text;
            if (mobileCounter) mobileCounter.innerText = text;

            if (count > 0) {
                if (desktopCounter) desktopCounter.style.opacity = '1';
                if (mobileCounter) mobileCounter.style.opacity = '1';
            }

            if (count === TOTAL_EGGS) {
                if (desktopCounter) {
                    desktopCounter.style.color = '#38bdf8';
                    desktopCounter.style.fontWeight = 'bold';
                }
                if (mobileCounter) {
                    mobileCounter.style.color = '#38bdf8';
                    mobileCounter.style.fontWeight = 'bold';
                }
            }
        }

        function trackEasterEgg(eggId) {
            let foundEggs = [];
            try {
                foundEggs = JSON.parse(localStorage.getItem('foundEasterEggs') || '[]');
            } catch (e) {
                console.error('Failed to parse easter egg data', e);
            }

            if (!foundEggs.includes(eggId)) {
                foundEggs.push(eggId);
                localStorage.setItem('foundEasterEggs', JSON.stringify(foundEggs));
                updateCounterUI();
            }
        }

        // Initial load
        document.addEventListener('DOMContentLoaded', updateCounterUI);
