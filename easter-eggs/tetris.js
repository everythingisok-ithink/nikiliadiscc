        const tetrisTrigger = document.getElementById('trigger-tetris');
        const bioParagraph = document.getElementById('bio-paragraph');
        const tetrisContainer = document.getElementById('tetris-container');
        let tetrisActive = false;
        let tetrisWords = [];
        let tetrisAnimationFrame;
        let resetTimeout;

        tetrisTrigger.addEventListener('click', () => {
            if (tetrisActive) return;
            tetrisActive = true;
            trackEasterEgg('tetris');

            if (typeof Sfx !== 'undefined' && Sfx.play) {
                Sfx.init();
                Sfx.play('playerHit'); // Use hit sound for crumbling effect
            }

            // Extract all text nodes and break them into SPANs
            const words = bioParagraph.innerText.split(/(\s+)/);
            tetrisContainer.innerHTML = '';
            tetrisWords = [];

            // Get paragraph bounds to match exact starting positions
            const containerRect = bioParagraph.parentElement.getBoundingClientRect();

            // Re-render text manually to grab coordinates
            bioParagraph.style.visibility = 'hidden';

            // A temporary clone to measure EXACT bounding rects of every word
            const clone = bioParagraph.cloneNode(true);
            clone.style.visibility = 'visible';
            clone.style.position = 'absolute';
            clone.style.top = bioParagraph.offsetTop + 'px';
            clone.style.left = bioParagraph.offsetLeft + 'px';
            clone.style.width = bioParagraph.offsetWidth + 'px';
            clone.innerHTML = words.map(w => w.trim() === '' ? w : `<span class="temp-measure">${w}</span>`).join('');

            bioParagraph.parentElement.appendChild(clone);

            const measures = clone.querySelectorAll('.temp-measure');
            measures.forEach(span => {
                const rect = span.getBoundingClientRect();
                const wordEl = document.createElement('span');
                wordEl.innerText = span.innerText;
                wordEl.className = 'tetris-word absolute text-lg md:text-xl font-light text-gray-400';

                // Calculate position relative to the local container
                const localY = rect.top - containerRect.top;
                const localX = rect.left - containerRect.left;

                wordEl.style.top = localY + 'px';
                wordEl.style.left = localX + 'px';
                wordEl.style.width = rect.width + 'px';
                wordEl.style.height = rect.height + 'px';

                tetrisContainer.appendChild(wordEl);

                tetrisWords.push({
                    el: wordEl,
                    x: localX,
                    y: localY,
                    w: rect.width,
                    h: rect.height,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() * -5) - 2, // Initial upward pop
                    isResting: false,
                    angle: 0,
                    vAngle: (Math.random() - 0.5) * 10
                });
            });

            clone.remove();

            // Give elements a fade transition for the cleanup phase
            tetrisWords.forEach(w => {
                w.el.style.transition = 'opacity 0.5s ease-out';
            });

            bioParagraph.style.transition = 'opacity 0.5s ease-in';

            let bottomBound = bioParagraph.parentElement.offsetHeight - 20;

            function updateTetris() {
                let allResting = true;

                tetrisWords.forEach(w => {
                    if (w.isResting) return;
                    allResting = false;

                    w.vy += 0.8; // Gravity
                    w.x += w.vx;
                    w.y += w.vy;
                    w.angle += w.vAngle;

                    // Add some air resistance
                    w.vx *= 0.98;

                    // Check floor collision
                    if (w.y + w.h >= bottomBound) {
                        w.y = bottomBound - w.h;
                        w.vy *= -0.3; // Bounce
                        w.vx *= 0.5; // Friction
                        w.vAngle *= 0.5;

                        if (Math.abs(w.vy) < 1) {
                            w.isResting = true;
                            w.vy = 0;
                            w.vx = 0;
                            w.vAngle = 0;
                        }
                    }

                    // Simple wall collision
                    if (w.x < 0) {
                        w.x = 0;
                        w.vx *= -0.5;
                    } else if (w.x + w.w > bioParagraph.parentElement.offsetWidth) {
                        w.x = bioParagraph.parentElement.offsetWidth - w.w;
                        w.vx *= -0.5;
                    }

                    w.el.style.transform = `translate(${w.x}px, ${w.y}px) rotate(${w.angle}deg)`;
                    // Since transform is used, we need to reset top/left to 0 to avoid double offsetting 
                    // from the initial absolute positioning setup
                    w.el.style.top = '0px';
                    w.el.style.left = '0px';
                });

                if (!allResting) {
                    tetrisAnimationFrame = requestAnimationFrame(updateTetris);
                } else {
                    // Start the 3 second auto-reset timer once everything has stopped moving
                    if (!resetTimeout) {
                        resetTimeout = setTimeout(resetTetris, 3000);
                    }
                }
            }

            tetrisAnimationFrame = requestAnimationFrame(updateTetris);
        });

        function resetTetris() {
            if (tetrisAnimationFrame) cancelAnimationFrame(tetrisAnimationFrame);

            // Fade out the falling words
            tetrisWords.forEach(w => w.el.style.opacity = '0');

            // Fade the paragraph back in
            bioParagraph.style.visibility = 'visible';
            bioParagraph.style.opacity = '1';

            // Clean up DOM after fade completes
            setTimeout(() => {
                tetrisContainer.innerHTML = '';
                tetrisWords = [];
                tetrisActive = false;
                resetTimeout = null;
                // Remove transition properties so it doesn't leak to other states
                bioParagraph.style.transition = '';
            }, 500); // Wait for the CSS transition
        }
