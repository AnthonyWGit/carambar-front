        document.addEventListener("DOMContentLoaded", () => {
            //fetch a random joke with reload if the same. If low number of jokes it is terrible performance if 10000 users would click
            //on the same time. Even then, extra load on the server. Get rid of memory + while loop to allow same joke loading.

            const apiHost = "https://fakembar.onrender.com"; //api base adress
            let isFirstJoke = true; //value used to controll animation replay 
            let memory; //used later to autofetch again if we land in the same joke 
            async function loadjoke() {
                try {//loading msg
                    const placeholder = document.querySelector(".placeholder");
                    if (placeholder) placeholder.textContent = "Chargement...";
                    //fetch data 
                    let response = await fetch(`${apiHost}/api/v1/jokes/random`);
                    if (!response.ok) throw new Error(`Erreur ${response.status}`); //err path 
                    let data = await response.json(); //the data
                    console.log(data);
                    if (memory !== "undefined" && memory === data.id) // if the fetch data is the same
                    {
                        while (data.id == memory)
                        {
                            response = await fetch(`${apiHost}/api/v1/jokes/random`);
                            if (!response.ok) throw new Error(`Erreur ${response.status}`);
                            console.log("retried", data.id, memory);
                            data = await response.json();
                        }                        
                    }
                    memory = data.id;
                    return data;
                } catch (error) {
                    console.error("Erreur:", error);
                    const element = document.querySelector(".placeholder") || document.querySelector(".pair");
                    if (element) element.textContent = "Erreur lors du chargement";
                    return null;
                }
            }
            //func to restart anim
            function restartAnimation(element) {
                // Remove animation class
                element.classList.remove("fadeRandom");
                
                // Trigger reflow - magic that resets the animation
                void element.offsetWidth;
                
                // Re-add animation class
                element.classList.add("fadeRandom");
            }

            function displayJoke(data) {
                //all the query selectors 
                let pairDiv = document.querySelector(".pair");
                let questionDiv = document.querySelector(".question");
                let answerDiv = document.querySelector(".answer");
                let paragraphQ = document.querySelector(".question p");
                let paragraphA = document.querySelector(".answer p");
                //!path if it's the first time we click because we have to create all the elements 
                if (!pairDiv) {
                    // Create elements on first click
                    pairDiv = document.createElement("div");
                    pairDiv.classList.add("pair");
                    
                    questionDiv = document.createElement("div");
                    questionDiv.classList.add("question");
                    
                    answerDiv = document.createElement("div");
                    answerDiv.classList.add("answer");
                    
                    paragraphQ = document.createElement("p");
                    paragraphA = document.createElement("p");
                    
                    questionDiv.appendChild(paragraphQ);
                    answerDiv.appendChild(paragraphA);
                    pairDiv.appendChild(questionDiv);
                    pairDiv.appendChild(answerDiv);
                    
                    const placeholder = document.querySelector(".placeholder");
                    if (placeholder) {
                        placeholder.replaceWith(pairDiv);
                    } else {
                        const imgWrapper = document.querySelector(".img-wrapper");
                        imgWrapper.insertAdjacentElement("afterend", pairDiv); // better innerHTML, no sensible data here but mdn recommand to 
                                                                            //not use them w/ inputs 
                                                                            // https://developer.mozilla.org/fr/docs/Web/API/Element/insertAdjacentHTML
                    }
                }
                
                // Update content
                paragraphQ.textContent = data.text;
                paragraphA.textContent = data.answer;
                
                // Animation reset via this trick https://css-tricks.com/restart-css-animation/
                if (isFirstJoke) {
                    // Add class for future animations
                    paragraphQ.classList.add("fadeRandom");
                    paragraphA.classList.add("fadeRandom");
                } else {
                    // Restart animation for subsequent jokes
                    restartAnimation(paragraphQ);
                    restartAnimation(paragraphA);
                }
                
                isFirstJoke = false;
            }
            //event listening waiting for click to start collect data and display jokes 
            document.querySelector(".img-wrapper").addEventListener('click', async () => {
                const data = await loadjoke();
                displayJoke(data);
            });
        });