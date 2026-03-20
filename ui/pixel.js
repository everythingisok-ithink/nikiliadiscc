// ── Shared Pixel Dissolve Logic ───────────────────────────────────────────
        const PixelTransition = (() => {
            const overlay = document.getElementById('pixel-overlay');
            const dissolveC = document.getElementById('dissolve-canvas');
            const dCtx = dissolveC.getContext('2d');
            const cvContent = document.getElementById('cv-content');

            const PIXEL = 6;
            const DURATION = 1100;
            const REVEAL_DUR = 950;
            let animating = false;

            function launch(targetEl, initFn) {
                if (animating) return;
                Sfx.init();
                animating = true;

                dissolveC.width = window.innerWidth;
                dissolveC.height = window.innerHeight;

                const cols = Math.ceil(dissolveC.width / PIXEL);
                const rows = Math.ceil(dissolveC.height / PIXEL);
                const total = cols * rows;

                // Shuffled block indices
                const indices = Array.from({ length: total }, (_, i) => i);
                for (let i = indices.length - 1; i > 0; i--) {
                    const j = (Math.random() * (i + 1)) | 0;
                    [indices[i], indices[j]] = [indices[j], indices[i]];
                }

                overlay.style.display = 'block';
                const colours = ['#0f172a', '#111827', '#0d1117', '#020617', '#0a0a1a'];
                const start = performance.now();

                function step(now) {
                    const progress = Math.min((now - start) / DURATION, 1);
                    const reveal = (progress * total) | 0;
                    const prev = (Math.max(0, progress - 16 / DURATION) * total) | 0;

                    for (let i = prev; i < reveal; i++) {
                        if (i >= total) break;
                        const idx = indices[i];
                        const col = idx % cols;
                        const row = (idx / cols) | 0;
                        dCtx.fillStyle = colours[(Math.random() * colours.length) | 0];
                        dCtx.fillRect(col * PIXEL, row * PIXEL, PIXEL, PIXEL);
                    }

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        // Fully dark — switch views
                        cvContent.style.display = 'none';
                        overlay.style.display = 'none';
                        targetEl.style.display = 'block';
                        if (initFn) initFn();
                        animating = false;
                    }
                }

                requestAnimationFrame(step);
            }

            function exit(targetEl) {
                if (animating) return;
                animating = true;

                dissolveC.width = window.innerWidth;
                dissolveC.height = window.innerHeight;
                const cols = Math.ceil(dissolveC.width / PIXEL);
                const rows = Math.ceil(dissolveC.height / PIXEL);
                const total = cols * rows;

                // 1. Paint the overlay fully dark
                dCtx.fillStyle = '#020617';
                dCtx.fillRect(0, 0, dissolveC.width, dissolveC.height);
                overlay.style.display = 'block';

                // 2. Swap the layers behind it
                targetEl.style.display = 'none';
                cvContent.style.display = '';

                // 3. Shuffle block indices
                const indices = Array.from({ length: total }, (_, i) => i);
                for (let i = indices.length - 1; i > 0; i--) {
                    const j = (Math.random() * (i + 1)) | 0;
                    [indices[i], indices[j]] = [indices[j], indices[i]];
                }

                const start = performance.now();

                // 4. Clear (erase) blocks to reveal the CV below
                function stepOut(now) {
                    const progress = Math.min((now - start) / REVEAL_DUR, 1);
                    const reveal = (progress * total) | 0;
                    const prev = (Math.max(0, progress - 16 / REVEAL_DUR) * total) | 0;
                    for (let i = prev; i < reveal; i++) {
                        if (i >= total) break;
                        const idx = indices[i];
                        const col = idx % cols;
                        const row = (idx / cols) | 0;
                        dCtx.clearRect(col * PIXEL, row * PIXEL, PIXEL, PIXEL);
                    }
                    if (progress < 1) {
                        requestAnimationFrame(stepOut);
                    } else {
                        overlay.style.display = 'none';
                        animating = false;
                    }
                }
                requestAnimationFrame(stepOut);
            }

            return { launch, exit };
        })();

        // Connect Space Shooter
        (() => {
            const trigger = document.getElementById('easter-egg-trigger');
            const gameEl = document.getElementById('game-container');
            const returnBtn = document.getElementById('return-btn');

            trigger.addEventListener('click', () => {
                trackEasterEgg('spaceshooter');
                PixelTransition.launch(gameEl, () => {
                    if (typeof initGame === 'function') initGame();
                });
            });

            returnBtn.addEventListener('click', () => {
                if (typeof stopGame === 'function') stopGame();
                PixelTransition.exit(gameEl);
            });
        })();

        // Connect SkiFree
        (() => {
            const trigger = document.getElementById('skifree-trigger');
            const gameEl = document.getElementById('skifree-container');
            const returnBtn = document.getElementById('skifree-return-btn');

            trigger.addEventListener('click', () => {
                trackEasterEgg('skifree');
                PixelTransition.launch(gameEl, () => {
                    if (typeof initSkiFree === 'function') initSkiFree();
                });
            });

            returnBtn.addEventListener('click', () => {
                if (typeof stopSkiFree === 'function') stopSkiFree();
                PixelTransition.exit(gameEl);
            });
        })();

