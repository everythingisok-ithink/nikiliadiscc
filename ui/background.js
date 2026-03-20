        function triggerCrab(e) {
            const btn = e.currentTarget;
            if (btn.classList.contains("is-morphed")) return;

            trackEasterEgg('crab');
            btn.classList.add("is-morphed");
            setTimeout(() => {
                btn.classList.remove("is-morphed");
            }, 3000);
        }
