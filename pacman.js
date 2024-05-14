const CELL_SIZE = 16;
const SNAP_THRESHOLD = 0.1;
let pacman, ghosts, level;

function setup() {
  level = new Level(createGrid(), { x: 13, y: 26 }, [{ x: 13, y: 17 }, { x: 14, y: 17 }]);

  const gridWidth = 28 * CELL_SIZE;
  const gridHeight = 36 * CELL_SIZE;
  createCanvas(gridWidth, gridHeight);

  pacman = new Pacman(13 * CELL_SIZE, 26 * CELL_SIZE, CELL_SIZE, 2);
  ghosts = [
    new Ghost(13 * CELL_SIZE, 17 * CELL_SIZE, "red"),
    new Ghost(14 * CELL_SIZE, 17 * CELL_SIZE, "blue")
  ];
}

function draw() {
  background(0);
  drawGrid();

  pacman.move();
  pacman.show();

  for (const ghost of ghosts) {
    ghost.move(pacman.x, pacman.y);
    ghost.show();
  }
}

function keyPressed() {
  switch (keyCode) {
    case UP_ARROW:
    case 87: // W key
      pacman.setDesiredDirection(0, -1);
      break;
    case DOWN_ARROW:
    case 83: // S key
      pacman.setDesiredDirection(0, 1);
      break;
    case LEFT_ARROW:
    case 65: // A key
      pacman.setDesiredDirection(-1, 0);
      break;
    case RIGHT_ARROW:
    case 68: // D key
      pacman.setDesiredDirection(1, 0);
      break;
  }
}

function createGrid() {
  const localGrid = [
    "                            ",
    "                            ",
    "                            ",
    "############################",
    "#            ##            #",
    "# #### ##### ## ##### #### #",
    "# #### ##### ## ##### #### #",
    "# #### ##### ## ##### #### #",
    "#                          #",
    "# #### ## ######## ## #### #",
    "# #### ## ######## ## #### #",
    "#      ##    ##    ##      #",
    "###### ##### ## ##### ######",
    "     # ##### ## ##### #     ",
    "     # ##          ## #     ",
    "     # ## ###  ### ## #     ",
    "###### ## #      # ## ######",
    "          #      #          ",
    "###### ## #      # ## ######",
    "     # ## ######## ## #     ",
    "     # ##          ## #     ",
    "     # ## ######## ## #     ",
    "###### ## ######## ## ######",
    "#            ##            #",
    "# #### ##### ## ##### #### #",
    "# #### ##### ## ##### #### #",
    "#   ##                ##   #",
    "### ## ## ######## ## ## ###",
    "### ## ## ######## ## ## ###",
    "#      ##    ##    ##      #",
    "# ########## ## ########## #",
    "# ########## ## ########## #",
    "#                          #",
    "############################",
    "                            ",
    "                            ",
  ];

  
  // Initialize the grid
  return localGrid;
}


class Level {
  constructor(layout, pacmanStart, ghostStarts) {
    // this.id = id;
    this.layout = this.validate(layout);
    this.pacmanStart = pacmanStart;
    this.ghostStarts = ghostStarts;
  }

  validate(layout) {
    if (!layout || !layout.length || !layout[0].length) {
      throw new Error("Invalid level layout: Empty or missing data");
    }

    const rowLength = layout[0].length;
    for (let i = 1; i < layout.length; i++) {
      if (layout[i].length !== rowLength) {
        throw new Error("Invalid level layout: Inconsistent row lengths");
      }
    }
    return layout;
  }
}


function drawGrid() {
  for (let y = 0; y < height / CELL_SIZE; y++) {
    for (let x = 0; x < width / CELL_SIZE; x++) {
      if (level.layout[y][x] === "#") {
        fill(220);
        rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

class Pacman {
  static RIGHT = { x: 1, y: 0 };
  static LEFT = { x: -1, y: 0 };
  static UP = { x: 0, y: -1 };
  static DOWN = { x: 0, y: 0 };

  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.direction = { x: 0, y: 0 }
    this.desiredDirection = { x: 0, y: 0 };
  };

  show() {
    fill(255, 255, 0);
    ellipse(this.x + CELL_SIZE / 2, this.y + CELL_SIZE / 2, this.size, this.size);
    const angle = this.getAngle();
    fill(0);
    arc(this.x + CELL_SIZE / 2, this.y + CELL_SIZE / 2, this.size / 2, this.size / 2, angle - PI / 7, angle + PI / 7);
  }

  move() {
    const newX = this.x + this.speed * this.desiredDirection.x;
    const newY = this.y + this.speed * this.desiredDirection.y;

    if (canMove(newX, newY, this.size)) {
      this.x = newX;
      this.y = newY;
      this.direction.x = this.desiredDirection.x;
      this.direction.y = this.desiredDirection.y;
    } else {
      const currentX = this.x + this.speed * this.direction.x;
      const currentY = this.y + this.speed * this.direction.y;

      if (canMove(currentX, currentY, this.size)) {
        this.x = currentX;
        this.y = currentY;
      }
    }
  }

  setDesiredDirection(x, y) {
    this.desiredDirection.x = x;
    this.desiredDirection.y = y;
  }

  getAngle() {
    if (this.direction.x > 0) {
      return 0;
    } else if (this.direction.x < 0) {
      return PI;
    } else if (this.direction.y > 0) {
      return PI / 2;
    } else {
      return -PI / 2;
    }
  }
}

class Ghost {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = CELL_SIZE;
    this.direction = { x: 0, y: 0 };
    this.color = color;
    this.mode = "CHASE";
    this.chaseThreshold = 8; // Chasing within these cells
    this.speed = 2;
  }


  show() {
    fill(this.color);
    ellipse(this.x + CELL_SIZE / 2, this.y + CELL_SIZE / 2, this.size, this.size);
    triangle(this.x + CELL_SIZE / 3, this.y + CELL_SIZE / 3, this.x + CELL_SIZE / 2, this.y, this.x + CELL_SIZE - CELL_SIZE / 3, this.y + CELL_SIZE / 3);
    fill(0);
    ellipse(this.x + CELL_SIZE / 3, this.y + CELL_SIZE / 3, this.size / 5, this.size / 5);
    ellipse(this.x + CELL_SIZE - CELL_SIZE / 3, this.y + CELL_SIZE / 3, this.size / 5, this.size / 5);
  }

  move(pacmanX, pacmanY) {
    // Calculate distance to Pacman (replace with your distance calculation logic)
    const distanceX = pacmanX - this.x;
    const distanceY = pacmanY - this.y;

    const ghostCell = canvasToGridCell(this.x, this.y);
    const pacmanCell = canvasToGridCell(pacman.x, pacman.y);

    // Choose target cell based on ghost mode and distance to Pacman
    let targetCell;
    if (this.mode === "CHASE" && Math.abs(distanceX) + Math.abs(distanceY) <= this.chaseThreshold * CELL_SIZE) {
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
      const newX = snapToCell(this.x + this.speed * this.direction.x);
      const newY = snapToCell(this.y + this.speed * this.direction.y);

      // Update position based on next cell in path and check for collision
      if (canMove(newX, newY, this.size)) {
        this.x = newX;
        this.y = newY;
        [this.direction.x, this.direction.y] = getDirectionTowards(this.x, this.y, nextCell.x, nextCell.y);
      }
    }
  }

}

function canMove(x, y, size) {
  const gridX1 = Math.floor(x / CELL_SIZE);
  const gridX2 = Math.floor((x + size - 1) / CELL_SIZE);
  const gridY1 = Math.floor(y / CELL_SIZE);
  const gridY2 = Math.floor((y + size - 1) / CELL_SIZE);
  return level.layout[gridY1] && level.layout[gridY2] &&
    level.layout[gridY2][gridX2] !== "#" &&
    level.layout[gridY1][gridX2] !== "#" &&
    level.layout[gridY2][gridX1] !== "#" &&
    level.layout[gridY1][gridX1] !== "#";
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
  const rowIndex = Math.floor(canvasY / CELL_SIZE);
  const colIndex = Math.floor(canvasX / CELL_SIZE);

  // Ensure row and column indices are within valid grid bounds (assuming 0-based indexing)
  return {
    row: rowIndex >= 0 ? rowIndex : null,
    col: colIndex >= 0 ? colIndex : null,
  };
}

function snapToCell(z) {
  // const snappedZ = Math.abs(z - Math.round(z)) < SNAP_THRESHOLD * CELL_SIZE ? Math.round(z) : z;
  const ratio = z / CELL_SIZE;
  const snappedZ = Math.abs(ratio - Math.round(ratio)) < SNAP_THRESHOLD ? Math.round(ratio) * CELL_SIZE : Math.round(z);
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
  const width = level.layout[0].length; // Get maze width from the first row's length
  const height = level.layout.length; // Get maze height from the number of rows
  const neighbors = [];

  // Check up neighbor (if within maze bounds and not a wall)
  if (y > 0 && level.layout[y - 1][x] === 0) {
    neighbors.push({ x, y: y - 1 });
  }

  // Check down neighbor (if within maze bounds and not a wall)
  if (y < height - 1 && level.layout[y + 1][x] === 0) {
    neighbors.push({ x, y: y + 1 });
  }

  // Check left neighbor (if within maze bounds and not a wall)
  if (x > 0 && level.layout[y][x - 1] === 0) {
    neighbors.push({ x: x - 1, y });
  }

  // Check right neighbor (if within maze bounds and not a wall)
  if (x < width - 1 && level.layout[y][x + 1] === 0) {
    neighbors.push({ x: x + 1, y });
  }

  return neighbors;
}

function getClosestPacmanCell(ghostCell, pacmanCell, viewDistance) {
  const width = level.layout[0].length; // Get maze width from the first row's length
  const height = level.layout.length; // Get maze height from the number of rows
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
      if (0 <= neighborX && neighborX < width && 0 <= neighborY && neighborY < height && level.layout[neighborY][neighborX] === 0) {
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
