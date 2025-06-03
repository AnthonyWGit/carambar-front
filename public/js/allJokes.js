        // Chargement initial des blagues
        const apiHost = 'https://fakembar.onrender.com';
        (async () => {
            const wrapper = document.querySelector("main.wrapper")
            try {
                const response = await fetch(`${apiHost}/api/v1/jokes/all`);
                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                }
                document.querySelector(".temp").remove();
                const jokes = await response.json();                
                jokes.forEach(joke => {
                    const newDivPair = document.createElement("div");
                    newDivPair.classList.add("pair");
                    
                    const newDivQuestion = document.createElement("div");
                    newDivQuestion.classList.add("question");
                    const newParagraphQuestion = document.createElement("p");
                    newParagraphQuestion.textContent = joke.text;
                    newDivQuestion.appendChild(newParagraphQuestion);
                    
                    const newDivAnswer = document.createElement("div");
                    newDivAnswer.classList.add("answer");
                    const newParagraphAnswer = document.createElement("p");
                    newParagraphAnswer.textContent = joke.answer;
                    newDivAnswer.appendChild(newParagraphAnswer);
                    
                    newDivPair.appendChild(newDivQuestion);
                    newDivPair.appendChild(newDivAnswer);
                    
                    wrapper.appendChild(newDivPair);
                });

            } catch (error) {
                console.error('Erreur:', error);
                const newParagraph = document.createElement("p");
                wrapper.appendChild(newParagraph);
                newParagraph.innerHTML = "Erreur lors du chargement des blagues";
            }
        })();