        const gravityTrigger = document.getElementById('trigger-gravity');
        let gravityFlipped = false;
        let gravityTimeout;

        gravityTrigger.addEventListener('click', () => {
            gravityFlipped = !gravityFlipped;
            trackEasterEgg('gravity');
            if (gravityTimeout) clearTimeout(gravityTimeout);

            if (gravityFlipped) {
                document.body.classList.add('gravity-flipped');
                if (typeof Sfx !== 'undefined' && Sfx.play) {
                    Sfx.init();
                    Sfx.play('transition');
                }

                // Auto-flip back after 3 seconds
                gravityTimeout = setTimeout(() => {
                    gravityFlipped = false;
                    document.body.classList.remove('gravity-flipped');
                    if (typeof Sfx !== 'undefined' && Sfx.play) {
                        Sfx.play('transition');
                    }
                }, 3000);

            } else {
                document.body.classList.remove('gravity-flipped');
                if (typeof Sfx !== 'undefined' && Sfx.play) {
                    Sfx.play('transition');
                }
            }
        });
