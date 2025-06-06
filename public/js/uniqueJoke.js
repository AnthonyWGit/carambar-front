        //set base URL for API 
        const apiHost = 'https://fakembar.onrender.com';
        //Initialization data - for navigation arrows and input
        let currentId = 1;
        let maxId = 0;
        //wait for the document to be loaded
        document.addEventListener('DOMContentLoaded', function() {
            const slideshowContainer = document.querySelector('.slideshow-container');
            let isFirstJoke = true;
            if (!slideshowContainer) {
                console.error('Conteneur du carrousel introuvable');
                return;
            }
            
            (async () => {
                try {
                    // Count all the jokes entries in the joke table 
                    const countResponse = await fetch(`${apiHost}/api/v1/jokes/countall`);
                    if (!countResponse.ok) {
                        throw new Error(`Erreur HTTP! Statut: ${countResponse.status}`);
                    }
                    //set 
                    const countData = await countResponse.json();
                    maxId = countData.count;
                    
                    // Empty the container so we don't see the "chargement des blagues" message 
                    slideshowContainer.innerHTML = '';
                    
                    //Create the slider content 
                    const slide = document.createElement('div');
                    slide.className = 'mySlides fade';
                    slide.style.display = 'block';
                    
                    const jokeContent = document.createElement('div');
                    jokeContent.className = 'joke-content';
                    
                    const question = document.createElement('p');
                    question.className = 'joke-question';
                    
                    const answer = document.createElement('p');
                    answer.className = 'joke-answer';
                    
                    jokeContent.appendChild(question);
                    jokeContent.appendChild(answer);
                    slide.appendChild(jokeContent);
                    slideshowContainer.appendChild(slide);
                    
                    // navi arrows creation
                    const prevLink = document.createElement('a');
                    prevLink.className = 'prev';
                    prevLink.innerHTML = '❮';
                    slideshowContainer.appendChild(prevLink);
                    
                    const nextLink = document.createElement('a');
                    nextLink.className = 'next';
                    nextLink.innerHTML = '❯';
                    slideshowContainer.appendChild(nextLink);
                    
                    //Creation of the input field 
                    const idNavContainer = document.createElement('div');
                    idNavContainer.className = 'id-navigation';
                    
                    const idInput = document.createElement('input');
                    //set defaults
                    idInput.type = 'number';
                    idInput.id = 'joke-id-input';
                    idInput.min = '1';
                    idInput.max = maxId;
                    idInput.value = currentId;
                    
                    const goButton = document.createElement('button');
                    goButton.id = 'go-to-joke';
                    goButton.textContent = 'Aller';
                    
                    idNavContainer.appendChild(idInput);
                    idNavContainer.appendChild(goButton);
                    slideshowContainer.appendChild(idNavContainer);
                    
                    // Load the first joke 
                    await loadJoke(currentId, question, answer);
                    slideshowContainer.classList.add("initialized");
                    isFirstJoke = false;

                    // Even listeners
                    prevLink.addEventListener('click', () => {
                        // Loop to the last joke if we are at the first one 
                        if (currentId === 1) {
                            currentId = maxId;
                        } else {
                            currentId--;
                        }
                        idInput.value = currentId;
                        loadJoke(currentId, question, answer);
                        restartAnimation(slide);
                    });
                    
                    nextLink.addEventListener('click', () => {
                        // go to first joke if we are at the last one 
                        if (currentId === maxId) {
                            currentId = 1;
                        } else {
                            currentId++;
                        }
                        idInput.value = currentId;
                        loadJoke(currentId, question, answer);
                        restartAnimation(slideshowContainer);
                    });
                    
                    goButton.addEventListener('click', () => {
                        const newId = parseInt(idInput.value);
                        if (newId >= 1 && newId <= maxId) {
                            currentId = newId;
                            loadJoke(currentId, question, answer);
                        } else {
                            alert(`ID doit être entre 1 et ${maxId}`);
                        }
                    });
                    
                    idInput.addEventListener('keyup', (e) => {
                        if (e.key === 'Enter') {
                            goButton.click();
                        }
                    });
                    
                } catch (error) {
                    console.error('Erreur:', error);
                    slideshowContainer.innerHTML = `<p class="temp">Erreur lors du chargement: ${error.message}</p>`;
                }
            })();
            
            // Function that will featch the data from the proper API route 
            async function loadJoke(id, questionElement, answerElement) {
                // Loading indicator 
                questionElement.innerHTML = '<span class="loader"></span>';
                answerElement.textContent = '';
                
                try {
                    const response = await fetch(`${apiHost}/api/v1/jokes/${id}`);
                    if (!response.ok) {
                        throw new Error(`Blague #${id} non trouvée`);
                    }
                    
                    const joke = await response.json();
                    
                    // Update content
                    questionElement.textContent = joke.text;
                    answerElement.textContent = joke.answer;
                    console.log(joke.answer)
                    
                } catch (error) {
                    console.error('Erreur:', error);
                    questionElement.textContent = 'Erreur lors du chargement';
                    answerElement.textContent = error.message;
                }
            }
        })
                    //func to restart anim
            function restartAnimation(element) {
                // Remove animation class
                element.classList.remove("fade");
                
                // Trigger reflow - magic that resets the animation cf csstrick link
                void element.offsetWidth;
                
                // Re-add animation class
                element.classList.add("fade");
            };