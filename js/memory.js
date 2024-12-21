document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const movesDisplay = document.getElementById('moves');
    const pairsDisplay = document.getElementById('pairs');
    const flipSound = document.getElementById('flipSound');
    const matchSound = document.getElementById('matchSound');
    const winSound = document.getElementById('winSound');

    const cardImages = [
        'taco', 'burrito', 'chili',
        'avocado', 'pinata', 'guitar'
    ];

    let cards = [...cardImages, ...cardImages];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true;

    // Shuffle cards
    cards.sort(() => Math.random() - 0.5);

    // Create cards
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.card = card;
        
        const img = document.createElement('img');
        img.src = `images/${card}.svg`;
        img.alt = card;
        
        cardElement.appendChild(img);
        cardElement.addEventListener('click', () => flipCard(cardElement));
        gameBoard.appendChild(cardElement);
    });

    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || flippedCards.length === 2) return;

        card.classList.add('flipped');
        if (flipSound) {
            flipSound.currentTime = 0;
            flipSound.play().catch(e => console.log('Audio play failed:', e));
        }

        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            canFlip = false;

            if (flippedCards[0].dataset.card === flippedCards[1].dataset.card) {
                matchedPairs++;
                pairsDisplay.textContent = matchedPairs;
                
                if (matchSound) {
                    matchSound.currentTime = 0;
                    matchSound.play().catch(e => console.log('Audio play failed:', e));
                }

                flippedCards = [];
                canFlip = true;

                if (matchedPairs === cardImages.length) {
                    if (winSound) {
                        winSound.currentTime = 0;
                        winSound.play().catch(e => console.log('Audio play failed:', e));
                    }
                    setTimeout(() => {
                        alert(`¡Felicidades! You won in ${moves} moves!`);
                    }, 500);
                }
            } else {
                setTimeout(() => {
                    flippedCards.forEach(card => card.classList.remove('flipped'));
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }
});
