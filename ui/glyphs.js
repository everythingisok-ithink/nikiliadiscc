        document.querySelectorAll('.icon-glyph[data-anim]').forEach(glyph => {
            glyph.addEventListener('click', () => {
                const anim = glyph.dataset.anim;
                // Remove to allow re-trigger
                glyph.classList.remove('glyph-animate', 'anim-' + anim);
                // Force reflow
                void glyph.offsetWidth;
                glyph.classList.add('glyph-animate', 'anim-' + anim);
            });
            glyph.addEventListener('animationend', () => {
                glyph.classList.remove('glyph-animate', 'anim-' + glyph.dataset.anim);
            });
        });
