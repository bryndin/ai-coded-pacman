const cellSize = 16;
let grid = [];
let pacman, ghosts;
let animationFrameId;

function setup() {
  const gridWidth = 28 * cellSize;
  const gridHeight = 36 * cellSize;
  createCanvas(gridWidth, gridHeight);
  grid = createGrid();
  pacman = new Pacman(13 * cellSize, 26 * cellSize);
  ghosts = [
    new Ghost(cellSize * 13, cellSize * 17, "red"),
    new Ghost(cellSize * 14, cellSize * 17, "blue"),
  ];
}

function draw() {
  background(0);
  drawGrid();

  pacman.move()
  pacman.show();

  ghosts.forEach((ghost) => ghost.show());
  // Add ghost movement logic here (optional)
}

function keyPressed() {
  if (keyCode === UP_ARROW || key === 'W') {
    pacman.setDirection(0, -1);
  } else if (keyCode === DOWN_ARROW || key === 'S') {
    pacman.setDirection(0, 1);
  } else if (keyCode === LEFT_ARROW || key === 'A') {
    pacman.setDirection(-1, 0);
  } else if (keyCode === RIGHT_ARROW || key === 'D') {
    pacman.setDirection(1, 0);
  }
}

function createGrid() {
  const localGrid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  return localGrid; // Return the created grid
}

function drawGrid() {
  for (let y = 0; y < height / cellSize; y++) {
    for (let x = 0; x < width / cellSize; x++) {
      if (grid[y][x] === 1) {
        fill(220);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

class Pacman {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = cellSize;
    this.directionX = 0;
    this.directionY = 0;
    this.speed = 100;
    this.lastMoveTime = 0;
  }

  show() {
    fill(255, 255, 0);
    ellipse(this.x + cellSize / 2, this.y + cellSize / 2, this.size, this.size);
    let angle = this.getAngle();
    fill(0);
    arc(this.x + cellSize / 2, this.y + cellSize / 2, this.size / 2, this.size / 2, angle - PI / 7, angle + PI / 7);
  }

  move() {
    const currentTime = performance.now(); // Get current time in milliseconds
    const deltaTime = (currentTime - this.lastMoveTime) / 1000; // Time difference in seconds

    // Calculate distance to move based on speed and deltaTime
    const distanceX = this.speed * deltaTime * this.directionX;
    const distanceY = this.speed * deltaTime * this.directionY;

    const newX = this.x + distanceX;
    const newY = this.y + distanceY;

    if (this.canMove(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }

    // Update last move time for next calculation
    this.lastMoveTime = currentTime;
  }

  setDirection(x, y) {
    this.directionX = x;
    this.directionY = y;
  }

  canMove(x, y) {
    const gridX1 = Math.floor(x / cellSize);
    const gridX2 = Math.floor((x + this.size - 1) / cellSize);
    const gridY1 = Math.floor(y / cellSize);
    const gridY2 = Math.floor((y + this.size - 1) / cellSize);
    return grid[gridY1] && grid[gridY2] &&
      grid[gridY2][gridX2] !== 1 &&
      grid[gridY1][gridX2] !== 1 &&
      grid[gridY2][gridX1] !== 1 &&
      grid[gridY1][gridX1] !== 1;
  }

  getAngle() {
    if (this.directionX > 0) {
      return 0;
    } else if (this.directionX < 0) {
      return PI;
    } else if (this.directionY > 0) {
      return PI / 2;
    } else {
      return PI / -2;
    }
  }
}

class Ghost {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = cellSize - 5;
    this.color = color;
    // Add random movement properties (optional)
  }

  show() {
    fill(this.color);
    ellipse(this.x + cellSize / 2, this.y + cellSize / 2, this.size, this.size);
    triangle(this.x + cellSize / 3, this.y + cellSize / 3, this.x + cellSize / 2, this.y, this.x + cellSize - cellSize / 3, this.y + cellSize / 3);
    fill(0);
    ellipse(this.x + cellSize / 3, this.y + cellSize / 3, this.size / 5, this.size / 5);
    ellipse(this.x + cellSize - cellSize / 3, this.y + cellSize / 3, this.size / 5, this.size / 5);
  }

  // Add a move function with random movement logic (optional)
}
