// ── SkiFree Game Engine ───────────────────────────────────────────────────
        const sfCanvas = document.getElementById('skifreeCanvas');
        const sfCtx = sfCanvas.getContext('2d');
        const sfScoreEl = document.getElementById('skifree-score');
        const sfHighScoreEl = document.getElementById('skifree-high-score');
        const sfInstructions = document.getElementById('skifree-instructions');

        let sfWidth, sfHeight;
        let sfScore = 0;
        let sfHighScore = 0;
        let sfGameActive = false;
        let sfAnimFrameId;
        let sfSpeed = 5;

        const sfPlayer = { x: 0, lastX: 0, y: 150, width: 24, height: 36, color: '#ef4444' };
        let sfObstacles = [];
        let sfParticles = [];

        const sfImgStraight = new Image();
        sfImgStraight.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="4" fill="%23ef4444"/><path d="M12 10v6 M8 22l4-4 4 4" stroke="%23ef4444"/><path d="M5 14l7-4 7 4" stroke="%23ef4444"/><path d="M6 21l12 0" stroke="%23334155" stroke-width="3"/></svg>';
        const sfImgLeft = new Image();
        sfImgLeft.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="6" r="4" fill="%23ef4444"/><path d="M10 10l-2 6 M4 20l4-4 6 2" stroke="%23ef4444"/><path d="M3 12l7-2 5 6" stroke="%23ef4444"/><path d="M4 19l10 5" stroke="%23334155" stroke-width="3"/></svg>';
        const sfImgRight = new Image();
        sfImgRight.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="14" cy="6" r="4" fill="%23ef4444"/><path d="M14 10l2 6 M20 20l-4-4-6 2" stroke="%23ef4444"/><path d="M21 12l-7-2-5 6" stroke="%23ef4444"/><path d="M20 19l-10 5" stroke="%23334155" stroke-width="3"/></svg>';

        const SF_STORAGE_KEY = 'iliadis_skifree';
        function loadSfData() {
            try {
                const raw = localStorage.getItem(SF_STORAGE_KEY);
                if (raw) sfHighScore = parseInt(raw, 10) || 0;
            } catch (e) { }
        }
        function saveSfData() {
            try { localStorage.setItem(SF_STORAGE_KEY, Math.floor(sfHighScore).toString()); } catch (e) { }
        }

        function sfResize() {
            sfWidth = window.innerWidth;
            sfHeight = window.innerHeight;
            sfCanvas.width = sfWidth;
            sfCanvas.height = sfHeight;
            sfPlayer.x = sfWidth / 2;
        }

        window.addEventListener('resize', () => {
            if (sfGameActive) sfResize();
        });

        function sfMoveEvent(x) {
            if (!sfGameActive) return;
            sfPlayer.x = x;
            if (sfInstructions.style.opacity !== '0') sfInstructions.style.opacity = '0';
        }

        window.addEventListener('mousemove', (e) => {
            if (sfGameActive) sfMoveEvent(e.clientX);
        });
        window.addEventListener('touchmove', (e) => {
            if (sfGameActive && e.touches.length > 0) sfMoveEvent(e.touches[0].clientX);
        }, { passive: false });

        class SfObstacle {
            constructor() {
                this.type = Math.random() < 0.7 ? 'tree' : 'rock';
                this.width = this.type === 'tree' ? 24 : 35;
                this.height = this.type === 'tree' ? 40 : 20;
                this.x = Math.random() * (sfWidth - this.width);
                this.y = sfHeight + this.height;
                this.color = this.type === 'tree' ? '#16a34a' : '#94a3b8';
            }
            update() { this.y -= sfSpeed; }
            draw() {
                sfCtx.fillStyle = this.color;
                if (this.type === 'tree') {
                    sfCtx.beginPath();
                    sfCtx.moveTo(this.x + this.width / 2, this.y - this.height);
                    sfCtx.lineTo(this.x + this.width, this.y);
                    sfCtx.lineTo(this.x, this.y);
                    sfCtx.fill();
                    sfCtx.fillStyle = '#78350f';
                    sfCtx.fillRect(this.x + this.width / 2 - 4, this.y, 8, 10);
                } else {
                    sfCtx.beginPath();
                    sfCtx.ellipse(this.x + this.width / 2, this.y - this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
                    sfCtx.fill();
                }
            }
        }

        function createSfExplosion(x, y) {
            for (let i = 0; i < 15; i++) {
                sfParticles.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    alpha: 1, color: '#cbd5e1'
                });
            }
        }

        function updateSfScore() {
            sfScoreEl.innerText = Math.floor(sfScore).toString().padStart(4, '0') + 'm';
            sfHighScoreEl.innerText = Math.floor(sfHighScore).toString().padStart(4, '0') + 'm';
        }

        function sfAnimate() {
            sfCtx.fillStyle = '#f8fafc';
            sfCtx.fillRect(0, 0, sfWidth, sfHeight);

            // Determine image based on movement
            let currentImg = sfImgStraight;
            if (sfPlayer.x < sfPlayer.lastX - 2) currentImg = sfImgLeft;
            else if (sfPlayer.x > sfPlayer.lastX + 2) currentImg = sfImgRight;

            // Draw skier
            sfCtx.drawImage(currentImg, sfPlayer.x - sfPlayer.width / 2, sfPlayer.y - sfPlayer.height / 2, sfPlayer.width, sfPlayer.height);

            sfPlayer.lastX = sfPlayer.x;

            let hit = false;
            sfObstacles.forEach((obs, i) => {
                obs.update();
                obs.draw();

                const px = sfPlayer.x - sfPlayer.width / 2;
                const py = sfPlayer.y - sfPlayer.height / 2;
                if (
                    px < obs.x + obs.width &&
                    px + sfPlayer.width > obs.x &&
                    py < obs.y &&
                    py + sfPlayer.height > obs.y - obs.height
                ) {
                    hit = true;
                }

                if (obs.y < -50) sfObstacles.splice(i, 1);
            });

            if (hit) {
                Sfx.play('playerHit');
                createSfExplosion(sfPlayer.x, sfPlayer.y);
                checkAchievements();
                if (sfScore > sfHighScore) {
                    sfHighScore = sfScore;
                    saveSfData();
                }
                sfScore = 0;
                sfSpeed = 5;
                sfObstacles = [];
                updateSfScore();
            } else {
                sfScore += sfSpeed * 0.015;
                sfSpeed += 0.0015;
                updateSfScore();
                if (Math.random() < 0.05) checkAchievements();
            }

            if (Math.random() < 0.03 + Math.max(0, (sfSpeed - 5) * 0.015)) sfObstacles.push(new SfObstacle());

            sfParticles.forEach((part, i) => {
                part.x += part.vx;
                part.y += part.vy;
                part.alpha -= 0.03;
                sfCtx.globalAlpha = Math.max(0, part.alpha);
                sfCtx.fillStyle = part.color;
                sfCtx.beginPath();
                sfCtx.arc(part.x, part.y, 3, 0, Math.PI * 2);
                sfCtx.fill();
                sfCtx.globalAlpha = 1;
                if (part.alpha <= 0) sfParticles.splice(i, 1);
            });

            if (sfGameActive) sfAnimFrameId = requestAnimationFrame(sfAnimate);
        }

        function initSkiFree() {
            loadSfData();
            sfGameActive = true;
            sfScore = 0;
            sfSpeed = 5;
            sfObstacles = [];
            sfParticles = [];
            sfInstructions.style.opacity = '1';
            sfResize();
            updateSfScore();
            sfAnimFrameId = requestAnimationFrame(sfAnimate);
        }

        function stopSkiFree() {
            sfGameActive = false;
            if (sfAnimFrameId) cancelAnimationFrame(sfAnimFrameId);
            if (sfScore > sfHighScore) {
                sfHighScore = sfScore;
                saveSfData();
            }
        }
