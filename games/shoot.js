// ── Space Shooter Game Engine ─────────────────────────────────────────────
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreEl = document.getElementById('game-score');
        const highScoreEl = document.getElementById('high-score');
        const instructions = document.getElementById('game-instructions');

        let width, height;
        let score = 0;
        let gameActive = false;
        let animFrameId;

        const player = { x: 0, y: 0, size: 20, color: '#0ea5e9' };
        let projectiles = [];
        let enemies = [];
        let particles = [];

        // ── Achievements & Persistence ──────────────────────────────────────────
        const STORAGE_KEY = 'iliadis_game';
        const ACHIEVEMENTS = {
            first_blood: { name: 'First Blood', check: (s) => s.sessionKills >= 1 },
            sharpshooter: { name: 'Sharpshooter', check: (s) => s.sessionKills >= 10 },
            centurion: { name: 'Centurion', check: (s) => s.totalKills >= 100 },
            survivor: { name: 'Survivor', check: (s) => s.score >= 5000 },
            ace: { name: 'Ace', check: (s) => s.score >= 25000 },
            legend: { name: 'Legend', check: (s) => s.score >= 100000 },
            ski_novice: { name: 'Ski Novice', check: (s) => s.sfScore >= 1000 },
            ski_pro: { name: 'Ski Pro', check: (s) => s.sfScore >= 5000 },
            ski_legend: { name: 'Ski Legend', check: (s) => s.sfScore >= 10000 },
        };

        let sessionKills = 0;
        let gameData = { highScore: 0, totalKills: 0, achievements: [] };

        /** Load persisted game data from localStorage. */
        function loadGameData() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    gameData = { ...gameData, ...parsed };
                }
            } catch (e) { /* ignore corrupt data */ }
        }

        /** Save current game data to localStorage. */
        function saveGameData() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
            } catch (e) { /* storage full or blocked */ }
        }

        /** Render persisted achievement states into the HUD icons. */
        function renderAchievements() {
            gameData.achievements.forEach(id => {
                const icon1 = document.querySelector(`#achievements-row .achievement-icon[data-id="${id}"]`);
                if (icon1 && !icon1.classList.contains('unlocked')) {
                    icon1.classList.add('unlocked');
                }
                const icon2 = document.querySelector(`#sf-achievements-row .achievement-icon[data-id="${id}"]`);
                if (icon2 && !icon2.classList.contains('unlocked')) {
                    icon2.classList.add('unlocked');
                }
            });
        }

        /** Show a toast notification for a newly unlocked achievement. */
        function showAchievementToast(name) {
            Sfx.play('achievement');
            const toast = document.createElement('div');
            toast.className = 'achievement-toast';
            toast.textContent = `★ ${name} Unlocked`;
            const container = (typeof sfGameActive !== 'undefined' && sfGameActive)
                ? document.getElementById('skifree-container')
                : document.getElementById('game-container');
            container.appendChild(toast);
            toast.addEventListener('animationend', () => toast.remove());
        }

        /** Unlock an achievement by ID if not already unlocked. */
        function unlockAchievement(id) {
            if (gameData.achievements.includes(id)) return;
            gameData.achievements.push(id);
            saveGameData();

            const icon1 = document.querySelector(`#achievements-row .achievement-icon[data-id="${id}"]`);
            if (icon1) icon1.classList.add('unlocked');
            const icon2 = document.querySelector(`#sf-achievements-row .achievement-icon[data-id="${id}"]`);
            if (icon2) icon2.classList.add('unlocked');

            showAchievementToast(ACHIEVEMENTS[id].name);
        }

        /** Check all achievement conditions against current state. */
        function checkAchievements() {
            const state = { sessionKills, totalKills: gameData.totalKills, score, sfScore: (typeof sfScore !== 'undefined' ? sfScore : 0) };
            for (const [id, def] of Object.entries(ACHIEVEMENTS)) {
                if (!gameData.achievements.includes(id) && def.check(state)) {
                    unlockAchievement(id);
                }
            }
        }

        /** Update high score display. */
        function updateHighScoreDisplay() {
            highScoreEl.innerText = gameData.highScore.toString().padStart(6, '0');
        }

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            player.x = width / 2;
            player.y = height - 100;
        }

        window.addEventListener('resize', resize);

        // Mouse tracking
        window.addEventListener('mousemove', (e) => {
            if (!gameActive) return;
            player.x = e.clientX;
            player.y = e.clientY;
            if (instructions.style.opacity !== '0') instructions.style.opacity = '0';
        });

        // Shooting
        window.addEventListener('mousedown', () => {
            if (!gameActive) return;
            Sfx.play('shoot');
            projectiles.push({ x: player.x, y: player.y - 15, speed: 12, radius: 3 });
        });

        /** Single descending diamond-shaped enemy. */
        class Enemy {
            constructor() {
                this.size = Math.random() * 20 + 10;
                this.x = Math.random() * width;
                this.y = -this.size;
                this.speed = Math.random() * 2 + 1;
                this.points = (this.size * 10) | 0;
                this.color = '#ef4444';
            }
            update() { this.y += this.speed; }
            draw() {
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.size);
                ctx.lineTo(this.x + this.size, this.y);
                ctx.lineTo(this.x, this.y + this.size);
                ctx.lineTo(this.x - this.size, this.y);
                ctx.closePath();
                ctx.stroke();
            }
        }

        /** Spawn particle burst at (x, y). */
        function createExplosion(x, y, color) {
            for (let i = 0; i < 8; i++) {
                particles.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    alpha: 1, color
                });
            }
        }

        function updateScore() {
            scoreEl.innerText = score.toString().padStart(6, '0');
        }

        function animate() {
            // Background with trail
            ctx.fillStyle = 'rgba(2, 6, 23, 0.3)';
            ctx.fillRect(0, 0, width, height);

            // Starfield
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            for (let i = 0; i < 10; i++) {
                ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
            }

            // Player ship
            ctx.shadowBlur = 15;
            ctx.shadowColor = player.color;
            ctx.strokeStyle = player.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(player.x, player.y - 20);
            ctx.lineTo(player.x + 15, player.y + 15);
            ctx.lineTo(player.x, player.y + 5);
            ctx.lineTo(player.x - 15, player.y + 15);
            ctx.closePath();
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Projectiles
            projectiles.forEach((p, i) => {
                p.y -= p.speed;
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
                if (p.y < 0) projectiles.splice(i, 1);
            });

            // Enemies
            enemies.forEach((enemy, eIdx) => {
                enemy.update();
                enemy.draw();

                // Bullet collision
                projectiles.forEach((p, pIdx) => {
                    if (Math.hypot(p.x - enemy.x, p.y - enemy.y) < enemy.size + p.radius) {
                        createExplosion(enemy.x, enemy.y, enemy.color);
                        Sfx.play('hit');
                        score += enemy.points;
                        sessionKills++;
                        gameData.totalKills++;
                        updateScore();
                        checkAchievements();
                        enemies.splice(eIdx, 1);
                        projectiles.splice(pIdx, 1);
                    }
                });

                // Player collision
                if (Math.hypot(player.x - enemy.x, player.y - enemy.y) < enemy.size + 15) {
                    score = Math.max(0, score - 500);
                    Sfx.play('playerHit');
                    updateScore();
                    createExplosion(player.x, player.y, '#fff');
                    enemies.splice(eIdx, 1);
                }

                if (enemy.y > height + 50) enemies.splice(eIdx, 1);
            });

            // Spawn
            if (Math.random() < 0.03) enemies.push(new Enemy());

            // Particles
            particles.forEach((part, i) => {
                part.x += part.vx;
                part.y += part.vy;
                part.alpha -= 0.02;
                ctx.globalAlpha = part.alpha;
                ctx.fillStyle = part.color;
                ctx.fillRect(part.x, part.y, 2, 2);
                ctx.globalAlpha = 1;
                if (part.alpha <= 0) particles.splice(i, 1);
            });

            if (gameActive) animFrameId = requestAnimationFrame(animate);
        }

        /** Reset state and start the game loop. */
        function initGame() {
            // Load persisted data
            loadGameData();
            renderAchievements();
            updateHighScoreDisplay();

            score = 0;
            sessionKills = 0;
            gameActive = true;
            projectiles = [];
            enemies = [];
            particles = [];
            instructions.style.opacity = '1';

            resize();
            updateScore();

            // Clear canvas
            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, width, height);

            animFrameId = requestAnimationFrame(animate);
        }

        /** Halt the game loop and persist data. */
        function stopGame() {
            gameActive = false;
            if (animFrameId) cancelAnimationFrame(animFrameId);

            // Update high score if beaten
            if (score > gameData.highScore) {
                gameData.highScore = score;
            }
            saveGameData();
        }

        // ── Hover Tooltip for Achievements ──
        (() => {
            loadGameData(); // Ensure gameData is populated before hover
            const trigger = document.getElementById('easter-egg-trigger');
            const tooltip = document.getElementById('egg-tooltip');

            trigger.addEventListener('mouseenter', () => {
                loadGameData();
                if (!gameData.achievements || gameData.achievements.length === 0) {
                    tooltip.style.display = 'none';
                    return;
                }

                if (tooltip.style.display === 'none') {
                    tooltip.style.display = 'flex';
                    // Force reflow to enable CSS transition when changing display
                    void tooltip.offsetWidth;
                }

                tooltip.innerHTML = '';

                gameData.achievements.forEach((id, i) => {
                    const srcIcon = document.querySelector(`#achievements-row .achievement-icon[data-id="${id}"]`);
                    if (srcIcon) {
                        const iconEl = srcIcon.cloneNode(true);
                        iconEl.classList.remove('unlocked');
                        Object.assign(iconEl.style, {
                            width: '18px',
                            height: '18px',
                            opacity: '0',
                            transform: 'translateY(10px) scale(0.8)',
                            filter: 'grayscale(0) drop-shadow(0 0 4px currentColor)',
                            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        });
                        tooltip.appendChild(iconEl);

                        setTimeout(() => {
                            iconEl.style.opacity = '1';
                            iconEl.style.transform = 'translateY(0) scale(1)';
                        }, i * 60 + 50);
                    }
                });
            });

            trigger.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    if (!trigger.matches(':hover')) {
                        tooltip.style.display = 'none';
                    }
                }, 300); // Wait for the fade-out CSS transition
            });
        })();

        // ── Hover Tooltip for SkiFree Achievements ──
        (() => {
            const sfTrigger = document.getElementById('skifree-trigger');
            const sfTooltip = document.getElementById('sf-egg-tooltip');

            sfTrigger.addEventListener('mouseenter', () => {
                loadGameData();
                const skiAchievements = gameData.achievements ? gameData.achievements.filter(id => id.startsWith('ski_')) : [];
                if (skiAchievements.length === 0) {
                    sfTooltip.style.display = 'none';
                    return;
                }

                if (sfTooltip.style.display === 'none') {
                    sfTooltip.style.display = 'flex';
                    void sfTooltip.offsetWidth;
                }

                sfTooltip.innerHTML = '';

                skiAchievements.forEach((id, i) => {
                    const srcIcon = document.querySelector(`#sf-achievements-row .achievement-icon[data-id="${id}"]`);
                    if (srcIcon) {
                        const iconEl = srcIcon.cloneNode(true);
                        iconEl.classList.remove('unlocked');
                        Object.assign(iconEl.style, {
                            width: '18px',
                            height: '18px',
                            opacity: '0',
                            transform: 'translateY(10px) scale(0.8)',
                            filter: 'grayscale(0) drop-shadow(0 0 4px currentColor)',
                            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        });
                        sfTooltip.appendChild(iconEl);

                        setTimeout(() => {
                            iconEl.style.opacity = '1';
                            iconEl.style.transform = 'translateY(0) scale(1)';
                        }, i * 60 + 50);
                    }
                });
            });

            sfTrigger.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    if (!sfTrigger.matches(':hover')) {
                        sfTooltip.style.display = 'none';
                    }
                }, 300);
            });
        })();

