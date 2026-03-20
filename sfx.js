        const Sfx = (() => {
            let audioCtx = null;
            function init() {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === 'suspended') audioCtx.resume();
            }
            function play(type) {
                if (!audioCtx) return;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                const t = audioCtx.currentTime;

                if (type === 'shoot') {
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(880, t);
                    osc.frequency.exponentialRampToValueAtTime(110, t + 0.1);
                    gain.gain.setValueAtTime(0.05, t);
                    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
                    osc.start(t);
                    osc.stop(t + 0.1);
                } else if (type === 'hit') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(100, t);
                    osc.frequency.exponentialRampToValueAtTime(10, t + 0.2);
                    gain.gain.setValueAtTime(0.1, t);
                    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
                    osc.start(t);
                    osc.stop(t + 0.2);
                } else if (type === 'playerHit') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(150, t);
                    osc.frequency.exponentialRampToValueAtTime(40, t + 0.4);
                    gain.gain.setValueAtTime(0.2, t);
                    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
                    osc.start(t);
                    osc.stop(t + 0.4);
                } else if (type === 'achievement') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, t);
                    osc.frequency.setValueAtTime(554.37, t + 0.1);
                    osc.frequency.setValueAtTime(659.25, t + 0.2);
                    osc.frequency.setValueAtTime(880, t + 0.3);
                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
                    gain.gain.setValueAtTime(0.1, t + 0.3);
                    gain.gain.linearRampToValueAtTime(0, t + 0.8);
                    osc.start(t);
                    osc.stop(t + 0.8);
                }
            }
            return { init, play };
        })();
