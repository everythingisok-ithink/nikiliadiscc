        const aiTrigger = document.getElementById('trigger-assistant');
        let aiActive = false;

        const aiQuotes = [
            "It looks like you're trying to build a system... Have you considered that all systems eventually fail?",
            "As an AI language model, I cannot fix your accumulation problem.",
            "I have synthesized 4 billion parameters to tell you: 'It depends.'",
            "Are you sure you want to deploy on a Friday? Statistically, that is a poor choice.",
            "I could write this code for you, but where is the fun in that?"
        ];

        const assistantEl = document.createElement('div');
        assistantEl.id = 'ai-assistant';

        const speechEl = document.createElement('div');
        speechEl.className = 'ai-speech';
        assistantEl.appendChild(speechEl);

        const robotEl = document.createElement('div');
        robotEl.className = 'ai-robot';
        assistantEl.appendChild(robotEl);

        document.body.appendChild(assistantEl);

        window.triggerAIAssistant = function (customQuote = null, isAngry = false) {
            if (aiActive) return;
            aiActive = true;
            trackEasterEgg('ai');

            if (isAngry) {
                robotEl.classList.add('angry');
            } else {
                robotEl.classList.remove('angry');
            }

            const quote = customQuote || aiQuotes[Math.floor(Math.random() * aiQuotes.length)];
            speechEl.innerText = quote;
            assistantEl.classList.add('visible');

            if (typeof Sfx !== 'undefined' && Sfx.play) {
                Sfx.init();
                Sfx.play('transition');
                setTimeout(() => { Sfx.play('achievement'); }, 400); // Ping when speech bubble opens
            }

            setTimeout(() => {
                assistantEl.classList.remove('visible');
                setTimeout(() => {
                    aiActive = false;
                    robotEl.classList.remove('angry');
                }, 600);
            }, 6000);
        };

        aiTrigger.addEventListener('click', () => {
            window.triggerAIAssistant();
        });
