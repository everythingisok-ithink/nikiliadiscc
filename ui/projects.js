        const PROJECTS = [
            { name: 'Kinili',       label: 'hire me',                              url: 'https://kinili.com' },
            { name: 'Killscreen',   label: 'a modern third place concept',         url: 'https://killscreen.bar' },
            { name: 'unusual.website', label: '?????????????',                     url: 'https://unusual.website' },
            { name: 'AETHERA ASU-1', label: 'user manual for the AETHERA ASU MODEL ONE', url: 'https://machine.monster' },
            { name: 'SIGNAL_LOST', label: 'mind the gap',                          url: 'https://nik.iliadis.cc/SIGNAL_LOST' }
        ];

        const projectsBtn     = document.getElementById('projects-btn');
        const projectsTerm    = document.getElementById('projects-terminal');
        const projectsContent = document.getElementById('projects-terminal-content');
        const projectsClose   = document.getElementById('projects-terminal-close');

        projectsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (projectsTerm.classList.contains('active')) {
                projectsTerm.classList.remove('active');
                return;
            }

            projectsContent.innerHTML = '';

            const header = document.createElement('div');
            header.className = 'term-line';
            header.textContent = '$ ls ~/projects';
            projectsContent.appendChild(header);

            projectsContent.appendChild(
                Object.assign(document.createElement('div'), { className: 'term-line', textContent: '' })
            );

            PROJECTS.forEach((p, i) => {
                setTimeout(() => {
                    const line = document.createElement('div');
                    line.className = 'term-line';
                    line.style.cssText = 'display:flex;flex-direction:column;gap:0.15rem;';

                    const topRow = document.createElement('div');
                    topRow.style.cssText = 'display:flex;gap:1rem;align-items:baseline;';

                    const prefix = document.createElement('span');
                    prefix.style.opacity = '0.3';
                    prefix.textContent = 'drwxr-xr-x';

                    const link = document.createElement('a');
                    link.className = 'project-link';
                    link.href = p.url;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = p.name;

                    topRow.appendChild(prefix);
                    topRow.appendChild(link);

                    const desc = document.createElement('span');
                    desc.style.cssText = 'opacity:0.4;font-size:0.78em;';
                    desc.textContent = p.label;

                    line.appendChild(topRow);
                    line.appendChild(desc);
                    projectsContent.appendChild(line);
                }, 150 + i * 180);
            });

            projectsTerm.classList.add('active');
        });

        projectsClose.addEventListener('click', () => {
            projectsTerm.classList.remove('active');
        });

        document.addEventListener('click', (e) => {
            if (projectsTerm.classList.contains('active') &&
                !projectsTerm.contains(e.target) &&
                e.target !==
                projectsBtn) {
                projectsTerm.classList.remove('active');
            }
        });
