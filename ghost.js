import Level from "./level.js";
import canMove from "./shared.js";

const CELL_SIZE = 16;
const SNAP_THRESHOLD = 0.1;

class Ghost {
    constructor(startPosition, color) {
        this.position = { x: startPosition.x * CELL_SIZE, y: startPosition.y * CELL_SIZE };;
        this.size = CELL_SIZE;
        this.direction = { x: 0, y: 0 };
        this.color = color;
        this.mode = "CHASE";
        this.chaseThreshold = 8; // Chasing within these cells
        this.speed = 2;
    }

    move(layout, targetPosition) {
        // Calculate distance to Pacman (replace with your distance calculation logic)
        const distanceX = targetPosition.x - this.position.x;
        const distanceY = targetPosition.y - this.position.y;

        const ghostCell = canvasToGridCell(this.position);
        const pacmanCell = canvasToGridCell(targetPosition);

        // Choose target cell based on ghost mode and distance to Pacman
        let targetCell;
        if (this.mode === "CHASE" && Math.abs(distanceX) + Math.abs(distanceY) <= this.chaseThreshold * CELL_SIZE) {
            targetCell = getClosestPacmanCell(layout, ghostCell, pacmanCell, 10); // Use A* to find closest Pacman cell within FOV
        } else if (this.mode === "SCATTER") {
            // TODO: implement later
            // targetCell = getScatterCell(this.type); // Predefined scatter point for this ghost type
        } else {
            // Handle frightened mode logic (random movement)
            targetCell = pacmanCell; // mock target being the cell with Pacman
        }

        // Update ghost position based on target cell and pathfinding
        const path = findPath(layout, ghostCell.col, ghostCell.row, targetCell.col, targetCell.row);
        if (path) { // Check if path exists (avoid getting stuck)
            const nextCell = path[0];

            const newPosition = {
                x: snapToCell(this.position.x + this.speed * this.direction.x),
                y: snapToCell(this.position.y + this.speed * this.direction.y),
            }

            // Update position based on next cell in path and check for collision
            if (canMove(layout, newPosition, this.size)) {
                this.position = newPosition;
                [this.direction.x, this.direction.y] = getDirectionTowards(this.position.x, this.position.y, nextCell.x, nextCell.y);
            }
        }
    }
};

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

function findPath(level, startX, startY, targetX, targetY) {
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
        const neighbors = getValidNeighbors(level, currentCell.x, currentCell.y);
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

function getValidNeighbors(layout, x, y) {
    const width = layout[0].length; // Get maze width from the first row's length
    const height = layout.length; // Get maze height from the number of rows
    const neighbors = [];

    // Check up neighbor (if within maze bounds and not a wall)
    if (y > 0 && Level.MOVABLE.has(layout[y - 1][x])) {
        neighbors.push({ x, y: y - 1 });
    }

    // Check down neighbor (if within maze bounds and not a wall)
    if (y < height - 1 && Level.MOVABLE.has(layout[y + 1][x])) {
        neighbors.push({ x, y: y + 1 });
    }

    // Check left neighbor (if within maze bounds and not a wall)
    if (x > 0 && Level.MOVABLE.has(layout[y][x - 1])) {
        neighbors.push({ x: x - 1, y });
    }

    // Check right neighbor (if within maze bounds and not a wall)
    if (x < width - 1 && Level.MOVABLE.has(layout[y][x + 1])) {
        neighbors.push({ x: x + 1, y });
    }

    return neighbors;
}

function getClosestPacmanCell(layout, ghostCell, pacmanCell, viewDistance) {
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
            if (0 <= neighborX && neighborX < width && 0 <= neighborY && neighborY < height && Level.MOVABLE.has(layout[neighborY][neighborX])) {
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

export default Ghost;