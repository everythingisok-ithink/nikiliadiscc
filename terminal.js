    (function(){
        const tOut   = document.getElementById('term-to');
        const tInp   = document.getElementById('term-ti');
        const tLayer = document.getElementById('term-layer');
        const gLayer = document.getElementById('gui-layer');
        const gBack  = document.getElementById('gui-back-btn');
        let tHistory = [], tHistIdx = -1, tAnimating = false;

        const BDAY_MS = 354326400000;
        function uptimeStr(){ return Math.floor((Date.now()-BDAY_MS)/(1000*60*60*24*365.25))+' YEARS'; }

        const TSK = 'nik_term_v4';
        function tSave(){ try{ localStorage.setItem(TSK, tOut.innerHTML); }catch(e){} }
        function tLoad(){ try{ return localStorage.getItem(TSK); }catch(e){ return null; } }

        function tEl(html, cls){
            const e = document.createElement('span');
            e.className = cls; e.innerHTML = html;
            tOut.appendChild(e); tOut.scrollTop = tOut.scrollHeight; return e;
        }
        function tBlank(){ tEl('','tX'); }

        function tPrint(lines, ms){
            tAnimating = true;
            return new Promise(resolve => {
                let i=0;
                function next(){
                    if(i>=lines.length){ tAnimating=false; tSave(); resolve(); return; }
                    const item=lines[i++];
                    if(item==='blank') tBlank();
                    else if(item==='__bio__') tBioBlock();
                    else tEl(item[0], item[1]);
                    tOut.scrollTop = tOut.scrollHeight;
                    setTimeout(next, ms);
                }
                next();
            });
        }

        function tBioBlock(){
            const wrap=document.createElement('div'); wrap.className='bio-blk';
            const img=document.createElement('img');
            img.src='profile.jpg'; img.alt='nik iliadis'; wrap.appendChild(img);
            const lines=document.createElement('div'); lines.className='bio-lines';
            const bio=[
                ['nik iliadis','color:#ffaa00;text-shadow:0 0 5px rgba(255,170,0,.85)'],
                ['',''],
                ["I started in IT before Google existed. My first website went up on",'color:#c87c00'],
                ["Geocities, I learned to code in IRC chatrooms, and YouTube wasn't",'color:#c87c00'],
                ["even a concept yet. That was twenty-five years ago. Since then I've",'color:#c87c00'],
                ["built and supported technology in some of the most demanding",'color:#c87c00'],
                ["environments there are, and I've learned a lot.",'color:#c87c00'],
                ['',''],
                ["What I've learned is that most organizations don't have a technology",'color:#c87c00'],
                ["problem. They have an accumulation problem. Years of decisions made",'color:#c87c00'],
                ["under pressure, tools adopted without a strategy, processes nobody",'color:#c87c00'],
                ["questions anymore because they predate everyone on the team. I find",'color:#c87c00'],
                ["that accumulation, cut what calcified, and replace what needs",'color:#c87c00'],
                ["replacing. The organizations I work with stop rebuilding the same",'color:#c87c00'],
                ["thing every three years. Not because the technology stopped changing,",'color:#c87c00'],
                ["but because they finally built something that can change with it.",'color:#c87c00'],
            ];
            bio.forEach(([text,style])=>{
                const s=document.createElement('span');
                s.style.cssText=(style||'')+(style&&style.includes('text-shadow')?'':text?';text-shadow:0 0 5px rgba(200,124,0,.65)':'');
                if(!text) s.style.height='1.6em';
                s.textContent=text; lines.appendChild(s);
            });
            wrap.appendChild(lines); tOut.appendChild(wrap); tOut.scrollTop=tOut.scrollHeight;
        }

        async function tBoot(){
            tInp.disabled=true;
            await tPrint([
                ['FASTBOOT: DISABLED','tD'],['BIOS v4.4','tD'],['cXXoXX1981','tD'],'blank',
                ['SOURCE: BALTIMORE','tD'],['UPTIME: '+uptimeStr(),'tD'],
                ['WARRANTY: expired','tD'],['STATUS: overly caffeinated','tD'],
                'blank',['loading…','tD'],'blank'
            ],120);
            tInp.disabled=false; tInp.focus();
        }

        function tStartX(){
            tPrint([['initializing graphical interface...','tD'],'blank'],80).then(()=>{
                setTimeout(()=>{
                    tLayer.classList.add('hiding');
                    setTimeout(()=>{ tLayer.classList.add('hidden'); gLayer.classList.add('visible'); gBack.style.display='block'; },420);
                },300);
            });
        }

        window.tReturn = function(){
            gLayer.classList.remove('visible'); gBack.style.display='none';
            tLayer.classList.remove('hidden');
            requestAnimationFrame(()=>{ tLayer.classList.remove('hiding'); });
            setTimeout(()=>{ tInp.focus(); },420);
        };

        const PROJ_URLS = {
            'killscreen':'https://killscreen.bar',
            'unusual.website':'https://unusual.website',
            'aethera asu-1':'https://machine.monster',
            'signal_lost':'https://nik.iliadis.cc/SIGNAL_LOST',
            'kinili':'https://kinili.com'
        };

        const TCMDS = {
            help: ()=>[
                ['commands','tB'],'blank',
                ['  bio              who i am','tL'],
                ['  whoami           short version','tL'],
                ['  ls               look around','tL'],
                ['  cat [file]       read a file','tL'],
                ['  cd [path]        go somewhere','tL'],
                ['  projects         things i\'ve built','tL'],
                ['  contact          get in touch','tL'],
                ['  startx           launch graphical interface','tL'],
                ['  history          command history','tL'],
                ['  clear            clear screen','tL'],
                ['...and some not listed here','tM'],'blank'
            ],
            bio: ()=>['__bio__','blank'],
            whoami: ()=>[
                ['nik iliadis','tB'],'blank',
                ["just some guy from baltimore.",'tL'],
                ["ravens fan. veteran. proud father.",'tL'],
                ["i like video games, books, movies, hiking, and my <a class=\"tlink\" href=\"dogs.jpg\" target=\"_blank\">dogs</a>.",'tL'],
                'blank',
                ["been doing this since geocities. still going.",'tD'],
                'blank'
            ],
            ls: ()=>[
                'blank',
                ['drwxr-xr-x  <span style="color:#3a8a8a;text-shadow:0 0 5px rgba(58,138,138,.7)">projects/</span>','tL'],
                ['drwxr-xr-x  <span style="color:#3a8a8a;text-shadow:0 0 5px rgba(58,138,138,.7)">contact/</span>','tL'],
                ['-rw-r--r--  bio.txt','tL'],
                ['-rw-r--r--  whoami.txt','tL'],
                ['-rw-------  <span style="color:#3a2200">.opinions        (very large)</span>','tL'],
                ['-rw-------  <span style="color:#3a2200">.regrets         (0 bytes)</span>','tL'],
                ['-rw-------  <span style="color:#3a2200">.secrets/</span>','tL'],
                'blank'
            ],
            projects: ()=>[
                ['projects','tB'],'blank',
                ['  <a class="tlink" href="https://killscreen.bar" target="_blank">Killscreen</a>              a modern third place concept','tL'],
                ['  <a class="tlink" href="https://unusual.website" target="_blank">unusual.website</a>          ?????????????','tL'],
                ['  <a class="tlink" href="https://machine.monster" target="_blank">AETHERA ASU-1</a>           user manual for the AETHERA ASU MODEL ONE','tL'],
                ['  <a class="tlink" href="https://nik.iliadis.cc/SIGNAL_LOST" target="_blank">SIGNAL_LOST</a>             mind the gap','tL'],
                'blank',['  click a name or type it to open','tM'],'blank'
            ],
            killscreen:          ()=>{ window.open('https://killscreen.bar','_blank'); return []; },
            'unusual.website':   ()=>{ window.open('https://unusual.website','_blank'); return []; },
            'aethera asu-1':     ()=>{ window.open('https://machine.monster','_blank'); return []; },
            signal_lost:         ()=>{ window.open('https://nik.iliadis.cc/SIGNAL_LOST','_blank'); return []; },
            contact: ()=>[
                ['contact','tB'],'blank',
                ['  <a class="tlink" href="mailto:nik@iliadis.cc">email</a>         nik@iliadis.cc','tL'],
                ['  <a class="tlink" href="https://linkedin.com/in/nik-iliadis" target="_blank">linkedin</a>      linkedin.com/in/nik-iliadis','tL'],
                'blank'
            ],
            linkedin:   ()=>{ window.open('https://linkedin.com/in/nik-iliadis','_blank'); return []; },
            email:      ()=>{ window.open('mailto:nik@iliadis.cc','_blank'); return []; },
            letterboxd: ()=>{ window.open('https://letterboxd.com/nik_iliadis/','_blank'); return []; },
            github:     ()=>{ window.open('https://github.com/everythingisok-ithink','_blank'); return []; },
            startx:     ()=>{ tStartX(); return []; },
            clear:      ()=>{ tOut.innerHTML=''; tSave(); return []; },
            history: ()=>{
                const lines=[['command history','tB'],'blank'];
                if(!tHistory.length) lines.push(['  no commands yet','tM']);
                else [...tHistory].reverse().forEach((c,i)=>lines.push(['  '+String(i+1).padStart(3,' ')+'  '+c,'tL']));
                lines.push('blank'); return lines;
            },
            'ls -la': ()=>[
                'blank',['total 42','tD'],
                ['drwxr-xr-x  nik  <span style="color:#3a8a8a">projects/</span>','tL'],
                ['-rw-r--r--  nik  bio.txt','tL'],
                ['-rw-------  nik  .regrets         (0 bytes)','tL'],
                ['-rw-------  nik  .opinions        (very large)','tL'],
                ['drwx------  nik  <span style="color:#3a2200">.secrets/</span>','tL'],
                'blank',['[secret found]','tS'],'blank'
            ],

            'sudo hire-me':  ()=>[['[sudo] password for recruiter:','tE'],'blank',['access granted.','tG'],['excellent taste. let\'s talk.','tB'],['→ nik@iliadis.cc','tL'],'blank',['[secret found]','tS'],'blank'],
            'sudo rm -rf /': ()=>[['sudo: you wish.','tE'],['nice try.','tD'],'blank',['[secret found]','tS'],'blank'],
            vim:             ()=>[['opening vim...','tD'],'blank',['you are now trapped.','tL'],['(i use neovim.)','tM'],'blank',['[secret found]','tS'],'blank'],
            neofetch: ()=>[
                'blank',
                ['  /\\            nik@iliadis.cc','tL'],
                [' /  \\           OS: Arch Linux','tL'],
                ['/    \\          Shell: fish','tL'],
                ['\\    /          Kernel: TKG-bore (custom)','tL'],
                [' \\  /           Machine: ASUS ProArt P16','tL'],
                ['  \\/            Coffee: always','tL'],
                'blank',['[secret found]','tS'],'blank'
            ],
            'man nik': ()=>[
                ['NIK(1)               User Commands              NIK(1)','tB'],'blank',
                ['NAME','tB'],['     nik — technology leader, veteran, chaos agent','tL'],'blank',
                ['SYNOPSIS','tB'],['     nik [--build | --break] [--lead | --code] organization','tL'],'blank',
                ['BUGS','tB'],['     strong opinions. difficulty suffering fools. arch evangelist.','tL'],'blank',
                ['[secret found]','tS'],'blank'
            ],
            'ping nik': ()=>[
                ['PING nik@iliadis.cc','tD'],
                ['64 bytes from nik: icmp_seq=1 ttl=64 time=0.4ms','tL'],
                ['64 bytes from nik: icmp_seq=2 ttl=64 time=0.3ms','tL'],
                ['64 bytes from nik: icmp_seq=3 ttl=64 time=0.3ms','tL'],'blank',
                ['3 packets transmitted, 3 received, 0% packet loss','tD'],
                ['nik is reachable.','tG'],'blank',['[secret found]','tS'],'blank'
            ],
            pwd:   ()=>[['/home/nik/life','tB'],'blank'],
            date:  ()=>[[new Date().toString().replace(/\(.*\)/,'').trim(),'tD'],'blank'],
            uname: ()=>[['nik-os 11.0.0-lts #1 SMP Army Veteran Made in Baltimore','tD'],'blank'],
            exit:  ()=>[['there is no exit. only more terminal.','tD'],'blank'],
            ski:   ()=>{ tStartX(); setTimeout(()=>{ const el=document.getElementById('skifree-trigger'); if(el) el.click(); },600); return [['launching ski...','tD'],'blank']; },
            shoot: ()=>{ tStartX(); setTimeout(()=>{ const el=document.getElementById('easter-egg-trigger'); if(el) el.click(); },600); return [['launching shoot...','tD'],'blank']; },
        };

        function tCdHandler(args){
            const p=(args||'~').trim().replace(/\/$/,'');
            if(p==='~'||p==='/home/nik'||p==='') return [['you\'re already home.','tD'],'blank'];
            if(p==='/') return [['everything is / if you think about it.','tD'],'blank'];
            if(p==='..') return [['there is nowhere behind you.','tD'],'blank'];
            if(p==='/dev/null') return [['bold choice. nothing to see there.','tD'],'blank'];
            if(p==='projects'||p==='./projects') return [
                ['projects/','tB'],'blank',
                ['  <a class="tlink" href="https://killscreen.bar" target="_blank">Killscreen</a>              a modern third place concept','tL'],
                ['  <a class="tlink" href="https://unusual.website" target="_blank">unusual.website</a>          ?????????????','tL'],
                ['  <a class="tlink" href="https://machine.monster" target="_blank">AETHERA ASU-1</a>           user manual for the AETHERA ASU MODEL ONE','tL'],
                ['  <a class="tlink" href="https://nik.iliadis.cc/SIGNAL_LOST" target="_blank">SIGNAL_LOST</a>             mind the gap','tL'],
                'blank'
            ];
            if(p==='contact'||p==='./contact') return [
                ['contact/','tB'],'blank',
                ['  <a class="tlink" href="mailto:nik@iliadis.cc">email</a>             nik@iliadis.cc','tL'],
                ['  <a class="tlink" href="https://linkedin.com/in/nik-iliadis" target="_blank">linkedin</a>          linkedin.com/in/nik-iliadis','tL'],
                ['  <a class="tlink" href="https://letterboxd.com/nik_iliadis/" target="_blank">letterboxd</a>        letterboxd.com/nik_iliadis','tL'],
                ['  <a class="tlink" href="https://github.com/everythingisok-ithink" target="_blank">github</a>            everythingisok-ithink','tL'],
                'blank'
            ];
            if(p==='.secrets'||p==='.secrets/') return [['permission denied','tE'],'blank',['[secret found]','tS'],'blank'];
            return [['cd: '+p+': no such directory','tE'],'blank'];
        }

        function tCatHandler(args){
            const f=(args||'').trim().toLowerCase();
            if(f==='bio.txt'||f==='bio') return ['__bio__','blank'];
            if(f==='whoami.txt') return [
                ["just some guy from baltimore.",'tL'],
                ["ravens fan. veteran. proud father.",'tL'],
                ["i like video games, books, movies, hiking, and my <a class=\"tlink\" href=\"dogs.jpg\" target=\"_blank\">dogs</a>.",'tL'],
                'blank',
                ["been doing this since geocities. still going.",'tD'],
                'blank'
            ];
            if(f==='.regrets') return [['cat: .regrets: file is empty','tD'],'blank',['[secret found]','tS'],'blank'];
            if(f==='.opinions') return [
                ['cat: .opinions: file too large to display','tE'],
                ['(trust me, you don\'t want all of it)','tM'],
                'blank',['[secret found]','tS'],'blank'
            ];
            if(f==='.secrets'||f==='.secrets/') return [['cat: .secrets: permission denied','tE'],'blank',['[secret found]','tS'],'blank'];
            return [['cat: '+args+': no such file','tE'],'blank'];
        }

        window.tRun = async function(raw){
            const trimmed=raw.trim();
            if(!trimmed||tAnimating) return;
            tHistory.unshift(trimmed); tHistIdx=-1;
            const pr=document.createElement('span');
            pr.className='tL';
            pr.innerHTML='<span style="color:#c87c00;text-shadow:0 0 5px rgba(200,124,0,.65)">nik.iliadis.cc &gt; </span>'+trimmed;
            tOut.appendChild(pr); tOut.scrollTop=tOut.scrollHeight;
            const lower=trimmed.toLowerCase();
            let lines;
            if(lower.startsWith('cd')) lines=tCdHandler(trimmed.slice(2).trim());
            else if(lower.startsWith('cat')) lines=tCatHandler(trimmed.slice(3).trim());
            else if(TCMDS[lower]) lines=TCMDS[lower]();
            else lines=[['command not found: '+trimmed,'tE'],["type 'help' to see available commands",'tM'],'blank'];
            if(lines&&lines.length) await tPrint(lines,38);
            tOut.scrollTop=tOut.scrollHeight;
        };

        tInp.addEventListener('keydown', e=>{
            if(e.key==='Enter'){ const v=tInp.value; tInp.value=''; tRun(v); }
            if(e.key==='ArrowUp'){ e.preventDefault(); if(tHistIdx<tHistory.length-1){ tHistIdx++; tInp.value=tHistory[tHistIdx]; } }
            if(e.key==='ArrowDown'){ e.preventDefault(); if(tHistIdx>0){ tHistIdx--; tInp.value=tHistory[tHistIdx]; }else{ tHistIdx=-1; tInp.value=''; } }
            if(e.key==='Tab'){ e.preventDefault(); const p=tInp.value.toLowerCase(); const m=Object.keys(TCMDS).find(k=>k.startsWith(p)&&k!==p); if(m) tInp.value=m; }
        });
        document.getElementById('term-layer').addEventListener('click', ()=>{ if(!tLayer.classList.contains('hidden')) tInp.focus(); });

        const saved=tLoad();
        if(saved){ tOut.innerHTML=saved; tOut.scrollTop=tOut.scrollHeight; tInp.focus(); }
        else tBoot();
    })();
