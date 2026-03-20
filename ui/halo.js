        (() => {
            const RADIUS = 55;              // effect radius in px
            const HALO_COLOR = [234, 255, 0]; // neon yellow-green

            // We walk the text nodes under #cv-content and colour characters
            // near the cursor hot-pink, fading to normal outside the radius.
            // Technique: wrap every character in a <span>, then on mousemove
            // update their color based on distance.

            const root = document.getElementById('cv-content');

            // Gather all text-bearing leaf nodes we want to affect
            const textSelectors = ['h1', 'p', 'a', 'div > p', 'nav a'];
            const spans = [];

            /** Recursively wrap each text character in a <span> for per-char halo coloring. */
            function wrapTextNodes(el) {
                // Walk child nodes; wrap text nodes char-by-char
                const childNodes = Array.from(el.childNodes);
                childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                        const frag = document.createDocumentFragment();
                        [...node.textContent].forEach(ch => {
                            const s = document.createElement('span');
                            s.className = 'halo-char';
                            s.textContent = ch;
                            s.style.transition = 'color 0.08s linear';
                            s.style.display = 'inline';
                            frag.appendChild(s);
                            spans.push(s);
                        });
                        node.replaceWith(frag);
                    } else if (node.nodeType === Node.ELEMENT_NODE &&
                        !node.closest('#easter-egg-trigger') &&
                        node.tagName !== 'IMG') {
                        wrapTextNodes(node);
                    }
                });
            }

            wrapTextNodes(root);

            let mx = -9999, my = -9999;

            document.addEventListener('mousemove', e => {
                mx = e.clientX;
                my = e.clientY;
            });

            /** Per-frame: color text, glyphs, and skyline near the cursor with the halo color. */
            function haloTick() {
                if (document.getElementById('game-container').style.display === 'block' ||
                    document.getElementById('skifree-container').style.display === 'block') {
                    requestAnimationFrame(haloTick);
                    return;
                }
                spans.forEach(s => {
                    const r = s.getBoundingClientRect();
                    const cx = r.left + r.width / 2;
                    const cy = r.top + r.height / 2;
                    const d = Math.hypot(mx - cx, my - cy);
                    if (d < RADIUS) {
                        const t = 1 - d / RADIUS;
                        const [hr, hg, hb] = HALO_COLOR;
                        const alpha = t * t; // quadratic falloff
                        // Lerp from white (255,255,255) → halo color — always full opacity,
                        // so text is never dark or illegible at the edges of the halo
                        const r = Math.round(255 + (hr - 255) * alpha) | 0;
                        const g = Math.round(255 + (hg - 255) * alpha) | 0;
                        const b = Math.round(255 + (hb - 255) * alpha) | 0;
                        s.style.color = `rgb(${r},${g},${b})`;
                        // Glow shadow, blur scales with proximity
                        s.style.textShadow = alpha > 0.1 ? [
                            `0 0 ${6 * alpha}px rgba(${hr},${hg},${hb},${alpha})`,
                            `0 0 ${16 * alpha}px rgba(${hr},${hg},${hb},${alpha * 0.6})`
                        ].join(',') : '';
                    } else {
                        s.style.color = '';
                        s.style.textShadow = '';
                    }
                });
                // Glyph halo — treat each .icon-glyph like a text span
                // Base color: indigo #6366f1 = [99, 102, 241]
                // SVGs inside use fill:currentColor, so changing `color` cascades through
                const BASE_ICON_COLOR = [99, 102, 241];
                const BASE_OPACITY = 0.29;
                document.querySelectorAll('.icon-glyph').forEach(g => {
                    const gr = g.getBoundingClientRect();
                    const gcx = gr.left + gr.width / 2;
                    const gcy = gr.top + gr.height / 2;
                    const gd = Math.hypot(mx - gcx, my - gcy);
                    if (gd < RADIUS) {
                        const gt = 1 - gd / RADIUS;
                        const ga = gt * gt;
                        const [hr, hg, hb] = HALO_COLOR;
                        const gr2 = Math.round(BASE_ICON_COLOR[0] + (hr - BASE_ICON_COLOR[0]) * ga) | 0;
                        const gg = Math.round(BASE_ICON_COLOR[1] + (hg - BASE_ICON_COLOR[1]) * ga) | 0;
                        const gb = Math.round(BASE_ICON_COLOR[2] + (hb - BASE_ICON_COLOR[2]) * ga) | 0;
                        g.style.color = `rgb(${gr2},${gg},${gb})`;
                        g.style.opacity = BASE_OPACITY + (1 - BASE_OPACITY) * ga;
                        g.style.filter = ga > 0.1
                            ? `drop-shadow(0 0 ${5 * ga}px rgba(${hr},${hg},${hb},${ga}))`
                            : '';
                    } else {
                        g.style.color = '';
                        g.style.opacity = '';
                        g.style.filter = '';
                    }
                });
                const poly = document.getElementById('skyline-poly');
                if (poly) {
                    const pr2 = poly.getBoundingClientRect();
                    const pcx = pr2.left + pr2.width / 2;
                    const pcy = pr2.top + pr2.height / 2;
                    const pd = Math.hypot(mx - pcx, my - pcy);
                    const SKYLINE_R = RADIUS * 3; // wider reach for the whole SVG
                    if (pd < SKYLINE_R) {
                        const pt = 1 - pd / SKYLINE_R;
                        const pa = pt * pt;
                        const [hr, hg, hb] = HALO_COLOR;
                        const sr = Math.round(255 + (hr - 255) * pa) | 0;
                        const sg = Math.round(255 + (hg - 255) * pa) | 0;
                        const sb = Math.round(255 + (hb - 255) * pa) | 0;
                        poly.setAttribute('stroke', `rgb(${sr},${sg},${sb})`);
                        if (pa > 0.05) {
                            poly.style.filter = `drop-shadow(0 0 ${4 * pa}px rgba(${hr},${hg},${hb},${pa}))`;
                        } else {
                            poly.style.filter = '';
                        }
                    } else {
                        poly.setAttribute('stroke', 'white');
                        poly.style.filter = '';
                    }
                }
                requestAnimationFrame(haloTick);
            }

            requestAnimationFrame(haloTick);
        })();
