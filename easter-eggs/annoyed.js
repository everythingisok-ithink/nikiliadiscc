        const profileContainer = document.getElementById('profile-container');
        let profileClickCount = 0;

        profileContainer.addEventListener('click', () => {
            profileClickCount++;

            // Remove animation to retrigger
            profileContainer.classList.remove('profile-red-pulse');
            // Trigger reflow
            void profileContainer.offsetWidth;

            // Add red pulse effect
            profileContainer.classList.add('profile-red-pulse');

            if (typeof Sfx !== 'undefined' && Sfx.play) {
                Sfx.init();
                // Using playerHit since it works well as an annoyed beep
                Sfx.play('playerHit');
            }

            if (profileClickCount === 5) {
                profileClickCount = 0; // Reset
                trackEasterEgg('profile');

                if (window.triggerAIAssistant) {
                    setTimeout(() => {
                        window.triggerAIAssistant("STOP CLICKING MY FACE!", true);
                    }, 300);
                }
            }
        });
