const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverDiv = document.getElementById('game-over');
const currentScoreEl = document.getElementById('current-score');
const highScoreEl = document.getElementById('high-score');
const finalScoreEl = document.getElementById('final-score');

const GRID_SIZE = 20;
const GRID_COUNT = canvas.width / GRID_SIZE;
const SNAKE_COLOR = '#82de16';
const FOOD_COLOR = '#de166b';
const GRID_COLOR = '#323351';

let snake = [];
let direction = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let highScore = 0;
let gameLoop = null;
let gameStarted = false;

function init() {
  snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
  ];
  direction = { x: 1, y: 0 };
  score = 0;
  gameStarted = true;
  updateScore();
  generateFood();
  gameOverDiv.style.display = 'none';
  startBtn.style.display = 'none';
  restartBtn.style.display = 'none';

  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(update, 100);
}

function generateFood() {
  do {
    food = {
      x: Math.floor(Math.random() * GRID_COUNT),
      y: Math.floor(Math.random() * GRID_COUNT)
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function update() {
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (head.x < 0 || head.x >= GRID_COUNT ||
      head.y < 0 || head.y >= GRID_COUNT ||
      snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    updateScore();
    generateFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = '#202152';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_COUNT; i++) {
    ctx.beginPath();
    ctx.moveTo(i * GRID_SIZE, 0);
    ctx.lineTo(i * GRID_SIZE, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * GRID_SIZE);
    ctx.lineTo(canvas.width, i * GRID_SIZE);
    ctx.stroke();
  }

  ctx.fillStyle = FOOD_COLOR;
  ctx.fillRect(
    food.x * GRID_SIZE + 1,
    food.y * GRID_SIZE + 1,
    GRID_SIZE - 2,
    GRID_SIZE - 2
  );

  ctx.fillStyle = SNAKE_COLOR;
  snake.forEach((segment, index) => {
    ctx.fillRect(
      segment.x * GRID_SIZE + 1,
      segment.y * GRID_SIZE + 1,
      GRID_SIZE - 2,
      GRID_SIZE - 2
    );
  });
}

function gameOver() {
  clearInterval(gameLoop);
  gameStarted = false;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore);
    updateScore();
  }

  finalScoreEl.textContent = score;
  gameOverDiv.style.display = 'block';
  restartBtn.style.display = 'inline-block';
}

function updateScore() {
  currentScoreEl.textContent = score;
  highScoreEl.textContent = highScore;
}

function loadHighScore() {
  const saved = localStorage.getItem('snakeHighScore');
  if (saved) {
    highScore = parseInt(saved, 10);
    updateScore();
  }
}

startBtn.addEventListener('click', init);
restartBtn.addEventListener('click', init);

document.addEventListener('keydown', (e) => {
  if (!gameStarted) return;

  const key = e.key;

  if ((key === 'ArrowUp' || key === 'Up') && direction.y === 0) {
    direction = { x: 0, y: -1 };
  } else if ((key === 'ArrowDown' || key === 'Down') && direction.y === 0) {
    direction = { x: 0, y: 1 };
  } else if ((key === 'ArrowLeft' || key === 'Left') && direction.x === 0) {
    direction = { x: -1, y: 0 };
  } else if ((key === 'ArrowRight' || key === 'Right') && direction.x === 0) {
    direction = { x: 1, y: 0 };
  }
});

loadHighScore();
draw();
