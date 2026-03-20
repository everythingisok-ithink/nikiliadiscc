        const terminalTrigger = document.getElementById('trigger-terminal');
        const terminalLines = [
            "> INIT AUTOMATION PROTOCOL...",
            "> BYPASSING MAINFRAME FIREWALLS... [OK]",
            "> OPTIMIZING SYNERGY MATRICES... [OK]",
            "> SYNCING BOLD IDEAS TO CLOUD... [WARNING: CLOUD FULL]",
            "> DOWNLOADING MORE RAM... [100%]",
            "> AUTOMATING AUTOMATION... [RECURSION ERROR]",
            "> REBOOTING UNIVERSE. PLEASE WAIT.",
            "> DONE. HAVE A NICE DAY."
        ];

        const terminal = document.createElement('div');
        terminal.id = 'retro-terminal';

        const terminalContent = document.createElement('div');
        terminalContent.style.position = 'relative';
        terminalContent.style.zIndex = '2';
        terminal.appendChild(terminalContent);

        document.body.appendChild(terminal);

        let termIsActive = false;

        terminalTrigger.addEventListener('click', () => {
            if (termIsActive) return;
            termIsActive = true;
            trackEasterEgg('terminal');

            terminalContent.innerHTML = '';
            terminal.classList.add('active');

            if (typeof Sfx !== 'undefined' && Sfx.play) {
                Sfx.init();
            }

            let lineIndex = 0;

            const writeInterval = setInterval(() => {
                if (lineIndex < terminalLines.length) {
                    const line = document.createElement('div');
                    line.className = 'term-line';
                    line.innerText = terminalLines[lineIndex];
                    terminalContent.appendChild(line);

                    if (typeof Sfx !== 'undefined' && Sfx.play) {
                        Sfx.play('achievement'); // Little blip for each line
                    }

                    lineIndex++;
                } else {
                    clearInterval(writeInterval);

                    // Retract after finishing
                    setTimeout(() => {
                        terminal.classList.remove('active');
                        setTimeout(() => { termIsActive = false; }, 600);
                    }, 2500);
                }
            }, 300); // 300ms per line
        });
