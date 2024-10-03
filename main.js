let score = 0;
let speed = 3; // Initial speed of the game
let gameActive = true; // Variable to track game state
let gameLoop; // Variable to store the interval ID

// Handle keydown events for jumping and ducking
document.onkeydown = function(e) {
    if (!gameActive) return; // Do nothing if the game is not active

    const dino = document.querySelector('.dino');
    if (e.keyCode === 38 || e.keyCode === 32) { // Up arrow key or space key
        if (!dino.classList.contains('animateDinoJump')) {
            dino.classList.add('animateDinoJump');
            setTimeout(() => {
                dino.classList.remove('animateDinoJump');
            }, 400); // Match this with the jump animation duration
        }
    }

    if (e.keyCode === 40) { // Down arrow key
        if (!dino.classList.contains('animateDinoDuck')) {
            dino.classList.add('animateDinoDuck');
            setTimeout(() => {
                dino.classList.remove('animateDinoDuck');
            }, 200); // Match this with the duck animation duration
        }
    }
};

// Function to check for collision
const checkCollision = () => {
    if (!gameActive) return;

    const dino = document.querySelector('.dino');
    const gameOver = document.querySelector('.gameOver');
    const obstacle = document.querySelector('.obstacle');

    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();


    // Check for collision using bounding rectangles
    if (dinoRect.left < obstacleRect.right &&
        dinoRect.right > obstacleRect.left &&
        dinoRect.top < obstacleRect.bottom &&
        dinoRect.bottom > obstacleRect.top) {
        gameOver.style.visibility = 'visible';
        obstacle.classList.remove('obstacleAni');
        gameActive = false; // End the game
    }
};

// Function to reset the game state
const restartGame = () => {
    score = 0;
    speed = 3;
    gameActive = true;

    // Reset score display
    document.getElementById('scoreCont').innerText = `Your Score: ${score}`;

    // Hide the game over message
    document.querySelector('.gameOver').style.visibility = 'hidden';

    // Reset obstacles positions and animation
    document.querySelectorAll('.obstacle').forEach(obstacle => {
        obstacle.classList.add('obstacleAni');
        obstacle.style.left = '44vw'; // Reset position
    });

    // Clear existing game loop interval if any
    if (gameLoop) {
        clearInterval(gameLoop);
    }

    // Restart the game loop
    gameLoop = setInterval(() => {
        moveObstacles();
        updateSpeed();
        updateScore();
    }, 100);
};

// Add event listener to the restart button
document.querySelector('.restartButton')?.addEventListener('click', restartGame);

// Function to update the game speed

const updateSpeed = () => {
    if (!gameActive) return;

    speed += 0.01; // Increase speed gradually
    document.querySelectorAll('.obstacle').forEach(obstacle => {
        const currentAnimationDuration = parseFloat(window.getComputedStyle(obstacle).animationDuration);
        obstacle.style.animationDuration = `${Math.max(1, currentAnimationDuration - 0.01)}s`;
    });
};

// Function to move obstacles and check for collisions
const moveObstacles = () => {
    if (!gameActive) return;

    document.querySelectorAll('.obstacle').forEach(obstacle => {
        const currentLeft = parseFloat(window.getComputedStyle(obstacle).getPropertyValue('left'));
        obstacle.style.left = `${currentLeft - speed}px`;

        // Reset position if obstacle is off-screen
        if (currentLeft < -obstacle.clientWidth) {
            obstacle.style.left = `${window.innerWidth}px`;
        }
    });

    checkCollision();
};


 const updateScore = () => {
     if (!gameActive) return;

     score += 1;
     document.getElementById('scoreCont').innerText = `Your Score: ${score}`;
    
     if (score % 100 === 0) {
        const scoreMessage = document.getElementById('scoreMessage');
        const scoreValue = document.getElementById('scoreValue');
        
        scoreValue.innerText = score;
        scoreMessage.classList.remove('hidden');
        scoreMessage.classList.add('blink');

        setTimeout(() => {
            scoreMessage.classList.remove('blink');
            scoreMessage.classList.add('hidden');
        }, 2000);
    }
};

     gameLoop = setInterval(() => {
         moveObstacles();
         updateSpeed();
         updateScore();
     }, 100);