const CELL_SIZE = 16;
const SNAP_THRESHOLD = 0.1;
let game, level;

function setup() {
  level = new Level(createGrid(), { x: 13 * CELL_SIZE, y: 26 * CELL_SIZE }, { "red": { x: 13 * CELL_SIZE, y: 17 * CELL_SIZE }, "blue": { x: 14 * CELL_SIZE, y: 17 * CELL_SIZE } });

  const gridWidth = 28 * CELL_SIZE;
  const gridHeight = 36 * CELL_SIZE;
  createCanvas(gridWidth, gridHeight);

  const levels = [level];
  game = new Game(levels);
}

function draw() {
  game.update();

  background(0);
  Renderer.drawLevel(level);
  Renderer.drawPacman(game.pacman.position, game.pacman.size, game.pacman.direction);
  for (const ghost of game.ghosts) {
    Renderer.drawGhost(ghost.position, ghost.size, ghost.color);
  }
}

function keyPressed() {
  switch (keyCode) {
    case UP_ARROW:
    case 87: // W key
      game.pacman.setDesiredDirection(Pacman.UP);
      break;
    case DOWN_ARROW:
    case 83: // S key
      game.pacman.setDesiredDirection(Pacman.DOWN);
      break;
    case LEFT_ARROW:
    case 65: // A key
      game.pacman.setDesiredDirection(Pacman.LEFT);
      break;
    case RIGHT_ARROW:
    case 68: // D key
      game.pacman.setDesiredDirection(Pacman.RIGHT);
      break;
  }
}

function createGrid() {
  return [
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
}


class Level {
  constructor(layout, pacmanStart, ghostStarts) {
    // this.id = id;
    this.layout = this.validate(layout);
    this.height = this.layout.length;
    this.width = this.layout[0].length;
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

class Game {
  constructor(levels) {
    this.levels = levels;
    this.score = 0;
    this.lives = 3;

    this.currentLevelIndex = 0;
    this.pacman = null;
    this.ghosts = [];

    this.setLevel(0);
  }

  getCurrentLevel() {
    return this.levels[this.currentLevelIndex];
  }

  update() {
    this.pacman.move();
    this.ghosts.forEach(ghost => ghost.move(this.pacman.position));
    // this.checkCollisions();
    // Check win/lose conditions (implement your logic here)
    if (this.isLevelComplete()) {
      this.setLevel(this.currentLevelIndex + 1);
    }
  }

  checkCollisions() {
    // Check pellet collisions (update score and remove pellet)
    // for (let i = 0; i < this.pellets.length; i++) {
    //   if (this.pacman.collide(this.pellets[i])) {
    //     this.score++;
    //     this.pellets.splice(i, 1);
    //     break;
    //   }
    // }

    // Check ghost collisions (handle lives or frightened mode)
    this.ghosts.forEach(ghost => {
      if (ghost.collideWithPacman()) {
        // Implement ghost collision logic here (lives loss or frightened mode)
        console.log("You lost life!");
      }
    });
  }

  isLevelComplete() {
    // Implement your logic to check if all pellets are eaten
    return false;
  }

  setLevel(n) {
    this.currentLevelIndex = n;
    if (this.currentLevelIndex < this.levels.length) {
      const level = this.getCurrentLevel();
      this.pacman = new Pacman(level.pacmanStart, CELL_SIZE, 2);

      this.ghosts = [];
      for (const color in level.ghostStarts) {
        this.ghosts.push(new Ghost(level.ghostStarts[color], color));
      }
    } else {
      // Handle game completion (win screen, etc.)
      console.log("You won the game!");
    }
  }
}

class Pacman {
  static RIGHT = { x: 1, y: 0 };
  static LEFT = { x: -1, y: 0 };
  static UP = { x: 0, y: -1 };
  static DOWN = { x: 0, y: 1 };

  constructor(startPosition, size, speed) {
    this.position = startPosition;
    this.size = size;
    this.speed = speed;
    this.direction = { x: 0, y: 0 }
    this.desiredDirection = { x: 0, y: 0 };
  };

  move() {
    const newPosition = {
      x: this.position.x + this.speed * this.desiredDirection.x,
      y: this.position.y + this.speed * this.desiredDirection.y,
    };

    if (canMove(newPosition, this.size)) {
      this.position = newPosition;
      this.direction = this.desiredDirection;
    } else {
      const currentPosition = {
        x: this.position.x + this.speed * this.direction.x,
        y: this.position.y + this.speed * this.direction.y,
      };

      if (canMove(currentPosition, this.size)) {
        this.position = currentPosition;
      }
    }
  }

  setDesiredDirection(direction) {
    this.desiredDirection = direction;
  }
}

class Ghost {
  constructor(startPosition, color) {
    this.position = startPosition;
    this.size = CELL_SIZE;
    this.direction = { x: 0, y: 0 };
    this.color = color;
    this.mode = "CHASE";
    this.chaseThreshold = 8; // Chasing within these cells
    this.speed = 2;
  }

  move(pacmanPosition) {
    // Calculate distance to Pacman (replace with your distance calculation logic)
    const distanceX = pacmanPosition.x - this.position.x;
    const distanceY = pacmanPosition.y - this.position.y;

    const ghostCell = canvasToGridCell(this.position);
    const pacmanCell = canvasToGridCell(pacmanPosition);

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

      const newPosition = {
        x: snapToCell(this.position.x + this.speed * this.direction.x),
        y: snapToCell(this.position.y + this.speed * this.direction.y),
      }

      // Update position based on next cell in path and check for collision
      if (canMove(newPosition, this.size)) {
        this.position = newPosition;
        [this.direction.x, this.direction.y] = getDirectionTowards(this.position.x, this.position.y, nextCell.x, nextCell.y);
      }
    }
  }

  collideWithPacman() {
    // TODO: check for collision with Pacman
    return false;
  }
}

function canMove(position, size) {
  const layout = level.layout;

  const gridX1 = Math.floor(position.x / CELL_SIZE);
  const gridX2 = Math.floor((position.x + size - 1) / CELL_SIZE);
  const gridY1 = Math.floor(position.y / CELL_SIZE);
  const gridY2 = Math.floor((position.y + size - 1) / CELL_SIZE);
  return layout[gridY1] && layout[gridY2] &&
    layout[gridY2][gridX2] !== "#" &&
    layout[gridY1][gridX2] !== "#" &&
    layout[gridY2][gridX1] !== "#" &&
    layout[gridY1][gridX1] !== "#";
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

function canvasToGridCell(canvasPosition) {
  // Calculate row and column indices based on canvas coordinates and cell size
  const rowIndex = Math.floor(canvasPosition.y / CELL_SIZE);
  const colIndex = Math.floor(canvasPosition.x / CELL_SIZE);

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
  const layout = level.layout;

  const width = layout[0].length; // Get maze width from the first row's length
  const height = layout.length; // Get maze height from the number of rows
  const neighbors = [];

  // Check up neighbor (if within maze bounds and not a wall)
  if (y > 0 && layout[y - 1][x] === 0) {
    neighbors.push({ x, y: y - 1 });
  }

  // Check down neighbor (if within maze bounds and not a wall)
  if (y < height - 1 && layout[y + 1][x] === 0) {
    neighbors.push({ x, y: y + 1 });
  }

  // Check left neighbor (if within maze bounds and not a wall)
  if (x > 0 && layout[y][x - 1] === 0) {
    neighbors.push({ x: x - 1, y });
  }

  // Check right neighbor (if within maze bounds and not a wall)
  if (x < width - 1 && layout[y][x + 1] === 0) {
    neighbors.push({ x: x + 1, y });
  }

  return neighbors;
}

function getClosestPacmanCell(ghostCell, pacmanCell, viewDistance) {
  const layout = level.layout;
  const width = layout[0].length; // Get maze width from the first row's length
  const height = layout.length; // Get maze height from the number of rows
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
      if (0 <= neighborX && neighborX < width && 0 <= neighborY && neighborY < height && layout[neighborY][neighborX] === 0) {
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

class Renderer {
  static drawLevel(level) {
    // const layout = level.layout;
    for (let y = 0; y < level.height; y++) {
      for (let x = 0; x < level.width; x++) {
        if (level.layout[y][x] === "#") {
          fill(220);
          rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }
  }

  static drawPacman(pos, size, dir) {
    function getAngle(dir) {
      if (dir.x > 0) {
        return 0;
      } else if (dir.x < 0) {
        return PI;
      } else if (dir.y > 0) {
        return PI / 2;
      } else {
        return -PI / 2;
      }
    }

    fill(255, 255, 0);
    ellipse(pos.x + CELL_SIZE / 2, pos.y + CELL_SIZE / 2, size, size);
    const angle = getAngle(dir);
    fill(0);
    arc(pos.x + CELL_SIZE / 2, pos.y + CELL_SIZE / 2, size / 2, size / 2, angle - PI / 7, angle + PI / 7);
  }

  static drawGhost(pos, size, color) {
    fill(color);
    ellipse(pos.x + CELL_SIZE / 2, pos.y + CELL_SIZE / 2, size, size);
    triangle(pos.x + CELL_SIZE / 3, pos.y + CELL_SIZE / 3, pos.x + CELL_SIZE / 2, pos.y, pos.x + CELL_SIZE - CELL_SIZE / 3, pos.y + CELL_SIZE / 3);
    fill(0);
    ellipse(pos.x + CELL_SIZE / 3, pos.y + CELL_SIZE / 3, size / 5, size / 5);
    ellipse(pos.x + CELL_SIZE - CELL_SIZE / 3, pos.y + CELL_SIZE / 3, size / 5, size / 5);
  }
}
