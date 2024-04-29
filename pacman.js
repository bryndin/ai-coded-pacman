const cellSize = 16;
let grid = [];
let pacman, ghosts;

function setup() {
  const gridWidth = 28 * cellSize;
  const gridHeight = 36 * cellSize;
  createCanvas(gridWidth, gridHeight);
  grid = createGrid();
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
  const localGrid = []; // Define a local grid variable
  // Outer walls
  for (let y = 0; y < height / cellSize; y++) {
    localGrid[y] = [];
    for (let x = 0; x < width / cellSize; x++) {
      if (x === 0 || x === width / cellSize - 1 || y === 0 || y === height / cellSize - 1) {
        localGrid[y][x] = "WALL";
      } else {
        localGrid[y][x] = "EMPTY";
      }
    }
  }

  // Inner walls (replace with your level design)
  const horizontalWalls = [
    // Horizontal walls (y, x1, x2)
    { y: 3, x1: 3, x2: 24 },
    { y: 3, x1: 7, x2: 10 },
    { y: 3, x1: 13, x2: 16 },
    { y: 3, x1: 19, x2: 22 },
    { y: 7, x1: 3, x2: 5 },
    { y: 7, x1: 8, x2: 10 },
    { y: 7, x1: 13, x2: 15 },
    { y: 7, x1: 18, x2: 22 },
    { y: 11, x1: 3, x2: 24 },
    { y: 11, x1: 7, x2: 10 },
    { y: 11, x1: 13, x2: 16 },
    { y: 11, x1: 19, x2: 22 },
    { y: 15, x1: 3, x2: 5 },
    { y: 15, x1: 8, x2: 10 },
    { y: 15, x1: 13, x2: 15 },
    { y: 15, x1: 18, x2: 22 },
  ];
  const verticalWalls = [
    // Vertical walls (y1, y2, x)
    { y1: 3, y2: 11, x: 3 },
    { y1: 3, y2: 11, x: 7 },
    { y1: 3, y2: 11, x: 10 },
    { y1: 3, y2: 11, x: 13 },
    { y1: 3, y2: 11, x: 16 },
    { y1: 3, y2: 11, x: 19 },
    { y1: 3, y2: 11, x: 22 },
    { y1: 15, y2: 23, x: 3 },
    { y1: 15, y2: 23, x: 7 },
    { y1: 15, y2: 23, x: 10 },
    { y1: 15, y2: 23, x: 13 },
    { y1: 15, y2: 23, x: 16 },
    { y1: 15, y2: 23, x: 19 },
    { y1: 15, y2: 23, x: 22 },
  ];

  horizontalWalls.forEach((wall) => {
    const y = wall.y; // Consistent naming for horizontal walls
    for (let x = wall.x1; x <= wall.x2; x++) {
      localGrid[y][x] = "WALL";
    }
  });
  
  verticalWalls.forEach((wall) => {
    for (let y = wall.y1; y <= wall.y2; y++) {
      const x = wall.x; // Consistent naming for vertical walls
      localGrid[y][x] = "WALL";
    }
  });

  return localGrid; // Return the created grid
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
      return grid[gridY] && grid[gridY][gridX] !== "WALL";
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
  