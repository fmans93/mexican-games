document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const eatSound = document.getElementById('eatSound');
    const gameOverSound = document.getElementById('gameOverSound');

    // Game settings
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let speed = 10;

    // Snake
    let snake = [
        { x: 10, y: 10 }
    ];
    let dx = 0;
    let dy = 0;

    // Food
    let food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
        color: getRandomColor()
    };

    // Score
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    document.getElementById('highScore').textContent = highScore;

    // Game loop
    function gameLoop() {
        updateSnake();
        if (checkGameOver()) return;
        clearCanvas();
        drawFood();
        drawSnake();
        setTimeout(gameLoop, 1000 / speed);
    }

    function updateSnake() {
        // Move snake
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('score').textContent = score;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('snakeHighScore', highScore);
                document.getElementById('highScore').textContent = highScore;
            }
            generateFood();
            speed = Math.min(speed + 0.5, 20);
            if (eatSound) {
                eatSound.currentTime = 0;
                eatSound.play().catch(e => console.log('Audio play failed:', e));
            }
        } else {
            snake.pop();
        }
    }

    function checkGameOver() {
        const head = snake[0];

        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return true;
        }

        // Check self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return true;
            }
        }

        return false;
    }

    function gameOver() {
        if (gameOverSound) {
            gameOverSound.currentTime = 0;
            gameOverSound.play().catch(e => console.log('Audio play failed:', e));
        }
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '48px Permanent Marker';
        ctx.textAlign = 'center';
        ctx.fillText('¡Game Over!', canvas.width/2, canvas.height/2);
        
        ctx.font = '24px Poppins';
        ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 40);
        ctx.fillText('Press Space to Restart', canvas.width/2, canvas.height/2 + 80);
    }

    function clearCanvas() {
        ctx.fillStyle = '#f1f2f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        snake.forEach((segment, index) => {
            const gradient = ctx.createLinearGradient(
                segment.x * gridSize,
                segment.y * gridSize,
                (segment.x + 1) * gridSize,
                (segment.y + 1) * gridSize
            );
            gradient.addColorStop(0, '#45322E');
            gradient.addColorStop(1, '#8B4513');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            
            if (index === 0) { // Draw eyes for head
                ctx.fillStyle = 'white';
                ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + 4, 4, 4);
                ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 4, 4, 4);
            }
        });
    }

    function drawFood() {
        const x = food.x * gridSize;
        const y = food.y * gridSize;
        
        ctx.fillStyle = food.color;
        ctx.beginPath();
        ctx.arc(x + gridSize/2, y + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
        ctx.fill();
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
            color: getRandomColor()
        };
        
        // Make sure food doesn't spawn on snake
        for (let segment of snake) {
            if (food.x === segment.x && food.y === segment.y) {
                generateFood();
                break;
            }
        }
    }

    function getRandomColor() {
        const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#ff6b81'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
        speed = 10;
        document.getElementById('score').textContent = '0';
        generateFood();
        gameLoop();
    }

    // Controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && (dx === 0 && dy === 0 || checkGameOver())) {
            resetGame();
            return;
        }

        switch(e.key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    });

    // Mobile controls
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        e.preventDefault();
    }, false);

    canvas.addEventListener('touchmove', (e) => {
        if (!touchStartX || !touchStartY) return;

        let touchEndX = e.touches[0].clientX;
        let touchEndY = e.touches[0].clientY;

        let deltaX = touchEndX - touchStartX;
        let deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0 && dx !== -1) { dx = 1; dy = 0; }
            else if (deltaX < 0 && dx !== 1) { dx = -1; dy = 0; }
        } else {
            if (deltaY > 0 && dy !== -1) { dx = 0; dy = 1; }
            else if (deltaY < 0 && dy !== 1) { dx = 0; dy = -1; }
        }

        touchStartX = touchEndX;
        touchStartY = touchEndY;
        e.preventDefault();
    }, false);

    // Start game
    clearCanvas();
    drawSnake();
    drawFood();
});
