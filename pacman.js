const cellSize = 16;
const snapThreshold = 0.1;
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

  for (const ghost of ghosts) {
    ghost.move(pacman.x, pacman.y);
    ghost.show();
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW || key === 'W') {
    pacman.setDesiredDirection(0, -1);
  } else if (keyCode === DOWN_ARROW || key === 'S') {
    pacman.setDesiredDirection(0, 1);
  } else if (keyCode === LEFT_ARROW || key === 'A') {
    pacman.setDesiredDirection(-1, 0);
  } else if (keyCode === RIGHT_ARROW || key === 'D') {
    pacman.setDesiredDirection(1, 0);
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
    [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
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
    this.desiredDirX = 0;
    this.desiredDirY = 0;
    this.speed = 2;
  }

  show() {
    fill(255, 255, 0);
    ellipse(this.x + cellSize / 2, this.y + cellSize / 2, this.size, this.size);
    let angle = this.getAngle();
    fill(0);
    arc(this.x + cellSize / 2, this.y + cellSize / 2, this.size / 2, this.size / 2, angle - PI / 7, angle + PI / 7);
  }

  move() {
    const newX = this.x + this.speed * this.desiredDirX;
    const newY = this.y + this.speed * this.desiredDirY;

    if (canMove(newX, newY, this.size)) {
      this.x = newX;
      this.y = newY;
      this.directionX = this.desiredDirX;
      this.directionY = this.desiredDirY;
    } else {
      const currentX = this.x + this.speed * this.directionX;
      const currentY = this.y + this.speed * this.directionY;

      if (canMove(currentX, currentY, this.size)) {
        this.x = currentX;
        this.y = currentY;
      }
    }
  }

  setDesiredDirection(x, y) {
    this.desiredDirX = x;
    this.desiredDirY = y;
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
    this.size = cellSize;
    this.directionX = 0;
    this.directionY = 0;
    this.color = color;
    this.mode = "CHASE";
    this.chaseThreshold = 8; // Chasing within these cells 
    this.type; // TODO: define different types
    this.speed = 2;
  }

  show() {
    fill(this.color);
    ellipse(this.x + cellSize / 2, this.y + cellSize / 2, this.size, this.size);
    triangle(this.x + cellSize / 3, this.y + cellSize / 3, this.x + cellSize / 2, this.y, this.x + cellSize - cellSize / 3, this.y + cellSize / 3);
    fill(0);
    ellipse(this.x + cellSize / 3, this.y + cellSize / 3, this.size / 5, this.size / 5);
    ellipse(this.x + cellSize - cellSize / 3, this.y + cellSize / 3, this.size / 5, this.size / 5);
  }

  move(pacmanX, pacmanY) {
    // Calculate distance to Pacman (replace with your distance calculation logic)
    const distanceX = pacmanX - this.x;
    const distanceY = pacmanY - this.y;

    const ghostCell = canvasToGridCell(this.x, this.y);
    const pacmanCell = canvasToGridCell(pacman.x, pacman.y);

    // Choose target cell based on ghost mode and distance to Pacman
    let targetCell;
    if (this.mode === "CHASE" && Math.abs(distanceX) + Math.abs(distanceY) <= this.chaseThreshold * cellSize) {
      targetCell = getClosestPacmanCell(ghostCell, pacmanCell, 10); // Use A* to find closest Pacman cell within FOV
    } else if (this.mode === "SCATTER") {
      // TODO: implement later
      // targetCell = getScatterCell(this.type); // Predefined scatter point for this ghost type
    } else {
      // Handle frightened mode logic (random movement)
      targetCell = pacmanCell; // mock target being the cell with Pacman
    }

    // Update ghost position based on target cell and pathfinding
    const path = findPath(ghostCell.col, ghostCell.row, targetCell.col, targetCell.row);
    if (path) { // Check if path exists (avoid getting stuck)
      const nextCell = path[0];
      const newX = snapToCell(this.x + this.speed * this.directionX);
      const newY = snapToCell(this.y + this.speed * this.directionY);

      // Update position based on next cell in path and check for collision
      if (canMove(newX, newY, this.size)) {
        this.x = newX;
        this.y = newY;
        [this.directionX, this.directionY] = getDirectionTowards(this.x, this.y, nextCell.x, nextCell.y);
      }
    }
  }

}

function canMove(x, y, size) {
  const gridX1 = Math.floor(x / cellSize);
  const gridX2 = Math.floor((x + size - 1) / cellSize);
  const gridY1 = Math.floor(y / cellSize);
  const gridY2 = Math.floor((y + size - 1) / cellSize);
  return grid[gridY1] && grid[gridY2] &&
    grid[gridY2][gridX2] !== 1 &&
    grid[gridY1][gridX2] !== 1 &&
    grid[gridY2][gridX1] !== 1 &&
    grid[gridY1][gridX1] !== 1;
}

function getDirectionTowards(x1, y1, x2, y2) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return [Math.sign(deltaX), 0];
  } else {
    return [0, Math.sign(deltaY)];
  }
}

function canvasToGridCell(canvasX, canvasY) {
  // Calculate row and column indices based on canvas coordinates and cell size
  const rowIndex = Math.floor(canvasY / cellSize);
  const colIndex = Math.floor(canvasX / cellSize);

  // Ensure row and column indices are within valid grid bounds (assuming 0-based indexing)
  return {
    row: rowIndex >= 0 ? rowIndex : null,
    col: colIndex >= 0 ? colIndex : null,
  };
}

function snapToCell(z) {
  // const snappedZ = Math.abs(z - Math.round(z)) < snapThreshold * cellSize ? Math.round(z) : z;
  const ratio = z/cellSize;
  const snappedZ = Math.abs(ratio - Math.round(ratio)) < snapThreshold ? Math.round(ratio)*cellSize : Math.round(z);
  return snappedZ
}

function findPath(startX, startY, targetX, targetY) {
  const queue = []; // Queue to store cells to explore
  const visited = {}; // Keep track of visited cells to avoid loops

  // Define starting cell and mark it visited
  queue.push({ x: startX, y: startY, distance: 0 });
  visited[`${startX}-${startY}`] = true;

  while (queue.length > 0) {
    const currentCell = queue.shift();

    // Check if current cell is the target cell
    if (currentCell.x === targetX && currentCell.y === targetY) {
      // Reconstruct the path by backtracking from the target cell
      return reconstructPath(currentCell);
    }

    // Explore adjacent cells (considering maze boundaries and walls)
    const neighbors = getValidNeighbors(currentCell.x, currentCell.y);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x}-${neighbor.y}`;
      if (!visited[neighborKey]) {
        visited[neighborKey] = true;
        queue.push({ ...neighbor, distance: currentCell.distance + 1, parent: currentCell });
      }
    }
  }

  // No path found
  return null;
}

// Helper function to reconstruct path from target cell back to starting point
function reconstructPath(cell) {
  const path = [];
  while (cell) {
    path.push(cell);
    cell = cell.parent;
  }
  return path.reverse(); // Reverse to get the path from start to target
}

function getValidNeighbors(x, y) {
  const width = grid[0].length; // Get maze width from the first row's length
  const height = grid.length; // Get maze height from the number of rows
  const neighbors = [];

  // Check up neighbor (if within maze bounds and not a wall)
  if (y > 0 && grid[y - 1][x] === 0) {
    neighbors.push({ x, y: y - 1 });
  }

  // Check down neighbor (if within maze bounds and not a wall)
  if (y < height - 1 && grid[y + 1][x] === 0) {
    neighbors.push({ x, y: y + 1 });
  }

  // Check left neighbor (if within maze bounds and not a wall)
  if (x > 0 && grid[y][x - 1] === 0) {
    neighbors.push({ x: x - 1, y });
  }

  // Check right neighbor (if within maze bounds and not a wall)
  if (x < width - 1 && grid[y][x + 1] === 0) {
    neighbors.push({ x: x + 1, y });
  }

  return neighbors;
}

function getClosestPacmanCell(ghostCell, pacmanCell, viewDistance) {
  const width = grid[0].length; // Get maze width from the first row's length
  const height = grid.length; // Get maze height from the number of rows
  const visited = {}; // Keep track of visited cells to avoid redundant checks

  // Define a queue to store cells to explore for BFS
  const queue = [];
  queue.push({ x: ghostCell.x, y: ghostCell.y, distance: 0 });
  visited[`${ghostCell.x}-${ghostCell.y}`] = true;

  let closestPacmanCell = null;
  let closestDistance = viewDistance + 1; // Initialize with a distance beyond the view

  while (queue.length > 0) {
    const currentCell = queue.shift();

    // Check if Pacman is found within the ghost's FOV
    if (currentCell.x === pacmanCell.x && currentCell.y === pacmanCell.y) {
      return currentCell; // Pacman found, return the cell
    }

    // Explore adjacent cells within the maze boundaries and view distance
    for (const direction of ["up", "down", "left", "right"]) {
      const neighborX = currentCell.x + getDeltaX(direction);
      const neighborY = currentCell.y + getDeltaY(direction);

      // Check if neighbor is within maze bounds and not a wall
      if (0 <= neighborX && neighborX < width && 0 <= neighborY && neighborY < height && grid[neighborY][neighborX] === 0) {
        const neighborKey = `${neighborX}-${neighborY}`;

        // Check if neighbor hasn't been visited and within view distance
        if (!visited[neighborKey] && getDistance(currentCell.x, currentCell.y, neighborX, neighborY) <= viewDistance) {
          visited[neighborKey] = true;
          queue.push({ x: neighborX, y: neighborY, distance: currentCell.distance + 1 });
        }
      }
    }

    // Update closestPacmanCell if a closer Pacman cell is found during exploration
    const distanceToPacman = getDistance(currentCell.x, currentCell.y, Pacman.x, Pacman.y);
    if (distanceToPacman < closestDistance && distanceToPacman <= viewDistance) {
      closestPacmanCell = currentCell;
      closestDistance = distanceToPacman;
    }
  }

  // No Pacman found within reachable cells in FOV
  return closestPacmanCell;
}

// Helper functions to get movement deltas based on direction
function getDeltaX(direction) {
  return direction === "left" ? -1 : (direction === "right" ? 1 : 0);
}

function getDeltaY(direction) {
  return direction === "up" ? -1 : (direction === "down" ? 1 : 0);
}

// Helper function to calculate distance between two cells (replace with your preferred distance calculation)
function getDistance(x1, y1, x2, y2) {
  // You can replace this with Manhattan distance or Euclidean distance based on your preference
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}