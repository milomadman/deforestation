class MemoryGame {

    constructor(opts) {
        this.node = opts.selector;
        this.cards = opts.cards.concat(opts.cards);

        this.clickedCards = [];
        this.timeout = null;

        this.cardMoves = 0;

        // how many cards have been collected so far
        this.cardsCollected = 0;
        this.cardsMatch = 0;

        this.board = this.node.querySelector('.memory-board');
        this.modal = this.node.querySelector('.modal');
        this.playBtn = this.node.querySelector('.playBtn');
        this.memoryMoves = this.node.querySelector('#memoryMoves');
        this.memoryMatches = this.node.querySelector('#memoryMatches');

        this.playBtn.addEventListener('click', (e) => {
            this.closeModal();
            this.startGame();
        });

        this.startGame();
    }

    startGame() {
        this.reset();
        this.shuffleCards();
        this.render();
        this.updateUI();

        this.cardCollectionBox = document.getElementById('memoryMatchesCards').getBoundingClientRect();

        const cardElements = this.node.querySelectorAll('.memory-card-item');
        cardElements.forEach(cardElement => {
            cardElement.addEventListener('click', (e) => {
                e.preventDefault()
                // prevent double click
                if (!e.detail || e.detail === 1) {
                    this.cardClicked(e);
                }
            });
        });
    }

    /**
     * Click event handler for card items
     * @param e - click event
     * @returns {boolean}
     */
    cardClicked(e) {
        const clickedCard = e.currentTarget;

        if (clickedCard.classList.contains('solved') || clickedCard.classList.contains('visible')) {
            return false;
        }

        if (this.clickedCards.length >= 2) {
            return false;
        }

        if (this.clickedCards.length <= 1) {
            clickedCard.classList.toggle('visible');
            this.clickedCards.push(clickedCard);

            if (this.clickedCards.length < 2) {
                return false;
            }
        }

        if (this.matchCards(this.clickedCards[0].getAttribute('data-card'), this.clickedCards[1].getAttribute('data-card'))) {
            this.cardsCollected += 2;
            this.cardsMatch++;
            
            
            //modal opens upon successful match, with content from data
            var animalid = e.currentTarget.getAttribute('data-card'); animalid --;
            var animalname = myJson.data[animalid].name;
            var animalclass = myJson.data[animalid].class;
            var animalage = myJson.data[animalid].age;
            var animalliste = myJson.data[animalid].liste_rouge;
            var animaldemog = myJson.data[animalid].tendance_démographique;
            var animalnombr = myJson.data[animalid].nombre_des_individus_matures;
            var animalgeo = myJson.data[animalid].répartition_géographique; animalid ++;
            
            var img = document.createElement("img");
            if (animalid<10) {
                img.src = "/PV/img/animals/0" + animalid +".jpg";
            } else {img.src = "/PV/img/animals/" + animalid +".jpg"}
            img.style.height = "40%"; img.style.width = "40%";
            var src = document.getElementById("picofanimal");
            src.appendChild(img);
            
            setTimeout(() => {
                document.getElementById('modal-match').style.display='block';
                document.getElementById("animalname").innerHTML = animalname;
                document.getElementById("animalclass").innerHTML = animalclass;
                document.getElementById("animalage").innerHTML = animalage;
                document.getElementById("animalliste").innerHTML = animalliste;
                document.getElementById("animaldemog").innerHTML = animaldemog;
                document.getElementById("animalnombr").innerHTML = animalnombr;
                document.getElementById("animalgeo").innerHTML = animalgeo;
                this.openModal('#modal-match');
            }, 300);

            setTimeout(() => {
                this.clickedCards.forEach(card => {
                    card.classList.add('solved');
                    this.collectCard(card);
                });

                this.clickedCards = [];
                this.checkGameEnd();
            }, 1000);

        } else {

            setTimeout(() => {
                this.clickedCards.forEach(card => {
                    card.classList.add('visible');
                });
                this.moveSlide('#noMatch');
            }, 300);

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {

                this.clickedCards.forEach(card => {
                    card.classList.remove('visible');
                    card.classList.remove('no-match');
                });
                this.clickedCards = [];
            }, 1000);
        }

        this.cardMoves++;
        this.updateUI();
    }

    /*
     * Reset the game variables
     */
    reset() {
        this.cardMoves = 0;
        this.cardsCollected = 0;
        this.cardsMatch = 0;
    }

    /**
     * Check if two cards have the same id.
     * @param a - card a
     * @param b - card b
     * @returns {boolean}
     */
    matchCards(a, b) {
        return a === b;
    }

    /**
     * Put the card into the collection box.
     * This will animate a <div> element from the card position to the collection box
     * @param card
     */
    collectCard(card) {
        const cardBox = card.getBoundingClientRect();
        const cardPosX = window.scrollX + cardBox.left;
        const cardPosY = window.scrollY + cardBox.top;

        let moveItemA = document.createElement('div');
        moveItemA.className = 'move-item';
        moveItemA.style.width = cardBox.width + 'px';
        moveItemA.style.height = cardBox.height + 'px';
        moveItemA.style.left = `${cardPosX}px`;
        moveItemA.style.top = `${cardPosY}px`;
        moveItemA.appendChild(card.querySelector('img').cloneNode());
        document.body.appendChild(moveItemA);

        setTimeout(() => {
            moveItemA.style.left = `${window.scrollX + this.cardCollectionBox.left}px`;
            moveItemA.style.top = `${window.scrollY + this.cardCollectionBox.top}px`;
            moveItemA.style.opacity = '0.0';
            moveItemA.style.scale = '0.5';
        }, 50);
    }

    /**
     * Simple shuffle
     */
    shuffleCards() {
        this.cards.sort(() => Math.random() - 0.5);  //remove sorting
    }

    /**
     * render the cards and put them to the board element
     */
    render() {
        this.board.innerHTML = '';
        this.cards.forEach((card, i) => {
            this.board.innerHTML += this.renderCard(card, i);
        });
    }

    /**
     * Define the html for a card item
     * @param card - the card object
     * @returns {string} - html of the card item
     */
    renderCard(card) {
        return `
            <div class="memory-card-item" data-card="${card.id}">
                <div class="memory-card-item-inner">
                    <div class="memory-card-item-front"></div>
                    <div class="memory-card-item-back">
                        <img src="../${card.img}" />
                    </div>
                </div>
            </div>
        `;
    }

    updateUI() {
        this.memoryMoves.innerHTML = this.cardMoves;
        this.memoryMatches.innerHTML = this.cardsMatch;
    }

    /**
     * Check if we collected all the cards and finish the game
     */
    checkGameEnd() {
        if (this.cards.length === this.cardsCollected) {
            //this here would happens as soon as last info is unlocked
        }
    }
                
                

    moveSlide(slideId) {
        let moveSlide = this.node.querySelector(slideId);
        moveSlide.classList.add('show');
        setTimeout(() => {
            moveSlide.classList.remove('show');
        }, 1000);
    }

    openModal() {
        this.modal.classList.add('modal-show');
    }

    closeModal() {
        this.modal.classList.remove('modal-show');
    }

}

let myJson = {"data": [
    {
      "id": 1,
      "name": "KOALA (Phascolarctos cinereus)",
      "class": "mammifère",
      "age": "6-8 ans",
      "liste_rouge": "vulnérable",
      "tendance_démographique": "décroissant",
      "nombre_des_individus_matures": "100000-500000",
      "répartition_géographique": "Australie (Victoria ; Australie-Méridionale ; Queensland ; Nouvelle-Galles du Sud)"
    },
    {
      "id": 2,
      "name": "IGUANE À BANDES LAU (Brachylophus fasciat)",
      "class": "reptiles",
      "age": "10-15 ans",
      "liste_rouge": "en danger",
      "tendance_démographique": "décroissant",
      "nombre_des_individus_matures": "8000-22000",
      "répartition_géographique": "îles Fidji et Tonga"
    },
    {
      "id": 3,
      "name": "PÉTREL DE MAGENTA (Pterodroma magentae)",
      "class": "oiseaux",
      "age": "19.5 ans",
      "liste_rouge": "en danger critique",
      "tendance_démographique": "croissant",
      "nombre_des_individus_matures": "80-100",
      "répartition_géographique": "Nouvelle-Zélande"
    },
    {
      "id": 4,
      "name": "LANGUR DORÉ (Trachypithecus geei)",
      "class": "mammifère",
      "age": "12 ans",
      "liste_rouge": "en danger",
      "tendance_démographique": "décroissant",
      "nombre_des_individus_matures": "6000-6500",
      "répartition_géographique": "Bhoutan ; Inde (Assam)"
    },
    {
      "id": 5,
      "name": "MOIRÉ DES SUDÈTES (Erebia sudetica)",
      "class": "insectes",
      "age": "moins d'un an",
      "liste_rouge": "vulnérable",
      "tendance_démographique": "décroissant",
      "nombre_des_individus_matures": "pas de données",
      "répartition_géographique": "Tchèque ; France ; Roumanie ; Suisse"
    },
    {
      "id": 6,
      "name": "BOUVREUIL DES AÇORES (Pyrrhula murina)",
      "class": "oiseaux",
      "age": "3.87 ans",
      "liste_rouge": "vulnérable",
      "tendance_démographique": "stable",
      "nombre_des_individus_matures": "500-1700",
      "répartition_géographique": "Portugal (Azores)"
    },
    {
      "id": 7,
      "name": "RENNE (Rangifer tarandus)",
      "class": "mammifère",
      "age": "8-9 ans",
      "liste_rouge": "vulnérable",
      "tendance_démographique": "décroissant",
      "nombre_des_individus_matures": "2890400",
      "répartition_géographique": "Canada ; Finlande ; Groenland ; Mongolie ; Norvège ; Fédération de Russie ; États-Unis"
    },
    {
      "id": 8,
      "name": "SPÉLERPÈS DE STRINATI (Speleomantes strinatii)",
      "class": "amphibiens",
      "age": "5-10 ans",
      "liste_rouge": "en danger",
      "tendance_démographique": "décroissant",
      "nombre_des_individus_matures": "pas de données",
      "répartition_géographique": "France (continentale) ; Italie (continentale)"
    },
    {
      "id": 9,
      "name": "TORTUES GÉANTES DES GALÁPAGOS (Chelonoidis vandenburghi)",
      "class": "reptiles",
      "age": "60 ans",
      "liste_rouge": "vulnérable",
      "tendance_démographique": "croissant",
      "nombre_des_individus_matures": "6320",
      "répartition_géographique": "Équateur (Galápagos)"
    },
    {
      "id": 10,
      "name": "OUAKARI CHAUVE (Cacajao calvus)",
      "class": "mammifère",
      "age": "10 ans",
      "liste_rouge": "vulnérable",
      "tendance_démographique": "décroissant",
      "nombre_des_individus_matures": "pas de données",
      "répartition_géographique": "Brésil ; Pérou"
    },
    {
      "id": 11,
      "name": "LOUP ROUGE (Canis rufus)",
      "class": "mammifère",
      "age": "10-13 ans",
      "liste_rouge": "en danger critique",
      "tendance_démographique": "décroissant",
      "nombre_des_individus_matures": "20-30",
      "répartition_géographique": "États-Unis (Caroline du Nord)"
    },
    {
      "id": 12,
      "name": "DHOLE (Cuon alpinus)",
      "class": "mammifère",
      "age": "5 ans",
      "liste_rouge": "en danger",
      "tendance_démographique": "décroissant",
      "nombre_des_individus_matures": "949-2215",
      "répartition_géographique": "Bangladesh ; Bhoutan ; Cambodge ; Chine ; Inde ; Indonésie ; République démocratique populaire lao ; Malaisie ; Myanmar ; Népal ; Thaïlande"
    },
    {
      "id": 13,
      "name": "PANGOLIN DE CHINE (Manis pentadactyla)",
      "class": "mammifère",
      "age": "7 ans",
      "liste_rouge": "en danger critique",
      "tendance_démographique": "décroissant",
      "nombre_des_individus_matures": "pas de données",
      "répartition_géographique": "Bangladesh ; Bhoutan ; Chine ; Hong Kong ; Inde ; République démocratique populaire lao ; Myanmar ; Népal ; Province chinoise de Taïwan ; Thaïlande ; Viêt Nam"
    },
    {
      "id": 14,
      "name": "ONCILLE (Leopardus tigrinus)",
      "class": "mammifère",
      "age": "5 ans",
      "liste_rouge": "vulnérable",
      "tendance_démographique": "décroissant",
      "nombre_des_individus_matures": "8932-10208",
      "répartition_géographique": "Bolivie, États plurinationaux de ; Brésil ; Colombie ; Costa Rica ; Équateur ; Guyane française ; Guyana ; Panama ; Pérou ; Suriname ; Venezuela"
    },
    {
      "id": 15,
      "name": "SERPENT-RATIER (Elaphe taeniura)",
      "class": "reptiles",
      "age": "3 ans",
      "liste_rouge": "vulnérable",
      "tendance_démographique": "décroissant",
      "nombre_des_individus_matures": "pas de données",
      "répartition_géographique": "Brunei Darussalam ; Chine ; Inde (Bengale occidental, Sikkim, Assam, Arunachal Pradesh) ; Indonésie (Sumatera) ; Japon (Nansei-shoto) ; République démocratique populaire lao ; Malaisie ; Myanmar ; Taïwan, province de Chine ; Thaïlande"
    },
    {
      "id": 16,
      "name": "SCARABÉE À LONG BRAS YANBARU (Cheirotonus jambar)",
      "class": "insectes",
      "age": "3-4 ans",
      "liste_rouge": "en danger",
      "tendance_démographique": "décroissant",
      "nombre_des_individus_matures": "pas de données",
      "répartition_géographique": "Japon (Nansei-shoto)"
    }
  ]
}

