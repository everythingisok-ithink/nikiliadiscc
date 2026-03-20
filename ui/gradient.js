        (() => {
            const bgColor = document.getElementById('bg-color');
            const gradCard = document.getElementById('gradient-card');

            document.addEventListener('mousemove', e => {
                if (bgColor) {
                    bgColor.style.setProperty('--mx', e.clientX + 'px');
                    bgColor.style.setProperty('--my', e.clientY + 'px');
                }
                if (gradCard) {
                    const rect = gradCard.getBoundingClientRect();
                    const localX = e.clientX - rect.left;
                    const localY = e.clientY - rect.top;
                    gradCard.style.setProperty('--local-mx', localX + 'px');
                    gradCard.style.setProperty('--local-my', localY + 'px');
                }
            });
            // Hide spotlight when mouse leaves the window
            document.addEventListener('mouseleave', () => {
                if (bgColor) {
                    bgColor.style.setProperty('--mx', '-999px');
                    bgColor.style.setProperty('--my', '-999px');
                }
                if (gradCard) {
                    gradCard.style.setProperty('--local-mx', '100%');
                    gradCard.style.setProperty('--local-my', '100%');
                }
            });
        })();
