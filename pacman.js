const cellSize = 40;
const grid = [];
let pacman, ghosts;

function setup() {
  createCanvas(400, 400);
  createGrid();
  pacman = new Pacman(cellSize, cellSize);
  ghosts = [
    new Ghost(cellSize * 5, cellSize * 5, "red"),
    new Ghost(cellSize * 11, cellSize * 5, "blue"),
  ];
}

function draw() {
  background(0);
  drawGrid();

  // Update Pacman position based on direction and collision check
  if (pacman.canMove(pacman.x + pacman.directionX * cellSize, pacman.y + pacman.directionY * cellSize)) {
    pacman.x += pacman.directionX * cellSize;
    pacman.y += pacman.directionY * cellSize;
  }

  pacman.show();
  ghosts.forEach((ghost) => ghost.show());
  // Add ghost movement logic here (optional)
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    pacman.setDirection(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    pacman.setDirection(0, 1);
  } else if (keyCode === LEFT_ARROW) {
    pacman.setDirection(-1, 0);
  } else if (keyCode === RIGHT_arrow) {
    pacman.setDirection(1, 0);
  }
}

function createGrid() {
  for (let y = 0; y < height / cellSize; y++) {
    grid[y] = [];
    for (let x = 0; x < width / cellSize; x++) {
      if (
        (x === 1 && y > 0 && y < height / cellSize - 1) ||
        (x === width / cellSize - 2 && y > 0 && y < height / cellSize - 1) ||
        ((y === 1 || y === height / cellSize - 2) && x > 1 && x < width / cellSize - 2) ||
        (x > 3 && x < width / cellSize - 4 && y === 1) ||
        (x > 3 && x < width / cellSize - 4 && y === height / cellSize - 2) ||
        (y === Math.floor(height / cellSize / 2) && (x === 1 || x === width / cellSize - 2))
      ) {
        grid[y][x] = "WALL";
      } else {
        grid[y][x] = "EMPTY";
      }
    }
  }
}

function drawGrid() {
  for (let y = 0; y < height / cellSize; y++) {
    for (let x = 0; x < width / cellSize; x++) {
      if (grid[y][x] === "WALL") {
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
      this.size = cellSize - 5;
      this.directionX = 0;
      this.directionY = 0;
    }
  
    show() {
      fill(255, 255, 0);
      ellipse(this.x + cellSize / 2, this.y + cellSize / 2, this.size, this.size);
      let angle = this.getAngle();
      fill(0);
      arc(this.x + cellSize / 2, this.y + cellSize / 2, this.size / 2, this.size / 2, angle - PI / 7, angle + PI / 7);
    }
  
    move() {
      if (!this.canMove(this.x + this.directionX * cellSize, this.y + this.directionY * cellSize)) {
        return;
      }
      this.x += this.directionX * cellSize;
      this.y += this.directionY * cellSize;
    }
  
    setDirection(x, y) {
      this.directionX = x;
      this.directionY = y;
    }
  
    canMove(x, y) {
      const gridX = Math.floor(x / cellSize);
      const gridY = Math.floor(y / cellSize);
      return grid[gridy] && grid[gridy][gridX] !== "WALL";
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
  