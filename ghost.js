import { getCell, CELL_SIZE } from "./renderer.js";

export const SCATTER_MODE = 'scatter';
export const CHASE_MODE = 'chase';
export const FRIGHTENED_MODE = 'frightened';

class Ghost {
    static name = "Ghost";

    constructor(color, startCell, scatterCell, level) {
        this.color = color;
        this.scatterCell = scatterCell;
        this.mode = CHASE_MODE;
        this.position = { x: (startCell.x + 0.5) * CELL_SIZE, y: (startCell.y + 0.5) * CELL_SIZE };
        this.speed = 2;
        this.path = []; // Store the calculated path
        this.level = level;
        this.size = CELL_SIZE;
        this.targetCell = startCell;
        this.lastDirection = null; // Store the last direction to prevent immediate reversals
    }

    update(pacmanCell, pacmanDirection, blinkyCell) {
        if (this.mode === SCATTER_MODE) {
            this.scatter();
        } else if (this.mode === CHASE_MODE) {
            this.chase(pacmanCell, pacmanDirection, blinkyCell);
        } else if (this.mode === FRIGHTENED_MODE) {
            this.frightened();
        }
        this.move();
    }

    scatter() {
        if (this.path.length !== 0 &&
            this.path[this.path.length - 1] !== this.scatterCell) {
            this.path = [];
        }

        const scatterX = (this.scatterCell.x + 0.5) * CELL_SIZE;
        const scatterY = (this.scatterCell.y + 0.5) * CELL_SIZE;

        if (this.path.length === 0 && (this.position.x !== scatterX && this.position.y !== scatterY)) {
            this.path = this.findPath(getCell(this.position), this.scatterCell);
        }
        this.targetCell = this.scatterCell;   // dev visualization
    }

    /**
     * Implements the chase strategy for a ghost.
     * 
     * This function determines the next move for the ghost based on the current position and direction of Pac-Man and the ghost itself.
     * 
     * @param {Object} pacmanCell - The current cell occupied by Pacman (e.g. {x: 1, y: 10}).
     * @param {string} pacmanDirection - The current direction Pacman is moving (e.g. 'up' = {x: 0; y: -1}).
     * @param {Object} blinkyCell - The current cell occupied by the ghost (Blinky).
     */
    chase(pacmanCell, pacmanDirection, blinkyCell) {
        // Chase behavior depends on the specific ghost
    }

    /**
     * Implements the frightened mode movement for a ghost. 
     * Ghosts move randomly, avoiding Pacman's cell.
     */
    frightened() {
        if (this.path.length === 0) {
            const currentCell = getCell(this.position);
            const possibleDirections = this.getNeighbors(currentCell).filter(cell => {
                const oppositeDirection = { x: currentCell.x - cell.x, y: currentCell.y - cell.y };
                return !this.lastDirection ||
                    (oppositeDirection.x !== this.lastDirection.x || oppositeDirection.y !== this.lastDirection.y);
            });

            if (possibleDirections.length > 0) {
                const randomIndex = Math.floor(Math.random() * possibleDirections.length);
                this.targetCell = possibleDirections[randomIndex];
                this.path = this.findPath(currentCell, this.targetCell);
                this.lastDirection = { x: this.targetCell.x - currentCell.x, y: this.targetCell.y - currentCell.y };
            }
        }
    }

    move() {
        if (this.path.length > 0) {
            // Move towards the next cell in the path
            const nextCell = this.path[0];
            this.moveTowardsCell(nextCell);

            // If the ghost has reached the center of the next cell, remove it from the path
            if (this.hasReachedCellCenter(nextCell)) {
                this.path.shift();
            }
        }
    }

    setMode(newMode) {
        this.mode = newMode;
        if (newMode === FRIGHTENED_MODE) {
            this.speed = 1; // Slow down the ghost in frightened mode
        } else {
            this.speed = 2; // Reset to normal speed
        }
    }

    // Helper functions

    /**
     * Finds a walkable target cell along the vector from Blinky to the initial inkyTarget.
     * 
     * @param {Object} blinkyCell - The cell occupied by Blinky.
     * @param {Object} inkyTarget - The initial target calculated for Inky.
     * @returns {Object} A walkable cell along the vector, or the original inkyTarget if none are found.
     */
    findWalkableTargetAlongVector(blinkyCell, inkyTarget) {
        const dx = inkyTarget.x - blinkyCell.x;
        const dy = inkyTarget.y - blinkyCell.y;

        // Backtrack from inkyTarget towards Blinky
        for (let step = 2; step >= 0; step--) { // Start from double the distance and backtrack
            const targetX = Math.round(blinkyCell.x + step * dx / 2); // Divide by 2 for half steps
            const targetY = Math.round(blinkyCell.y + step * dy / 2);

            // Check if the cell is within bounds and not a wall
            if (this.isValidTargetCell(targetX, targetY)) {
                return { x: targetX, y: targetY };
            }
        }

        // If no walkable cell is found along the vector, return the original target
        return inkyTarget;
    }

    isValidTargetCell(x, y) {
        return this.level.reachableCells.has(`${x},${y}`);
    }

    moveTowardsCell(cell) {
        const targetX = (cell.x + 0.5) * CELL_SIZE;
        const targetY = (cell.y + 0.5) * CELL_SIZE;

        this.position.x += Math.sign(targetX - this.position.x) * Math.min(this.speed, Math.abs(targetX - this.position.x));
        this.position.y += Math.sign(targetY - this.position.y) * Math.min(this.speed, Math.abs(targetY - this.position.y));
    }

    hasReachedCellCenter(cell) {
        const cellCenterX = (cell.x + 0.5) * CELL_SIZE;
        const cellCenterY = (cell.y + 0.5) * CELL_SIZE;

        return Math.abs(this.position.x - cellCenterX) < this.speed &&
            Math.abs(this.position.y - cellCenterY) < this.speed;
    }

    findPath(startCell, targetCell) {
        // Implementation of Breadth-First Search (BFS) algorithm
        const queue = [];
        const visited = new Set();
        const parents = {};

        queue.push(startCell);
        visited.add(`${startCell.x},${startCell.y}`);

        while (queue.length > 0) {
            const current = queue.shift();
            if (current.x === targetCell.x && current.y === targetCell.y) {
                return this.reconstructPath(parents, targetCell);
            }

            for (const neighbor of this.getNeighbors(current)) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;
                if (!visited.has(neighborKey)) {
                    queue.push(neighbor);
                    visited.add(neighborKey);
                    parents[neighborKey] = current;
                }
            }
        }

        return []; // No path found
    }

    getNeighbors(cell) {
        const neighbors = [];
        const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];

        for (const direction of directions) {
            const newX = cell.x + direction[0];
            const newY = cell.y + direction[1];

            if (this.level.reachableCells.has(`${newX},${newY}`)) {
                neighbors.push({ x: newX, y: newY });
            }
        }

        return neighbors;
    }

    reconstructPath(parents, targetCell) {
        const path = [];
        let current = targetCell;

        while (current) {
            path.unshift(current);
            const currentKey = `${current.x},${current.y}`;
            current = parents[currentKey];
        }

        return path;
    }

    calculateDistance(target) {
        // Calculate distance between ghost and target
        const cellPosition = getCell(this.position);
        let dx = cellPosition.x - target.x;
        let dy = cellPosition.y - target.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

export class Blinky extends Ghost {
    static name = "Blinky";

    constructor(startCell, scatterCell, level) {
        super('red', startCell, scatterCell, level);
    }

    chase(pacmanCell, pacmanDirection, blinkyCell) {
        // Directly target Pacman's position

        // Calculate the path only if it's not already calculated or the target has moved
        if (this.path.length === 0 ||
            this.path[this.path.length - 1].x !== pacmanCell.x ||
            this.path[this.path.length - 1].y !== pacmanCell.y) {
            this.path = this.findPath(getCell(this.position), pacmanCell);
        }
        this.targetCell = pacmanCell;
    }
}

export class Pinky extends Ghost {
    static name = "Pinky";

    constructor(startCell, scatterCell, level) {
        super('pink', startCell, scatterCell, level);
    }

    chase(pacmanCell, pacmanDirection, blinkyCell) {
        // Target 4 tiles ahead of Pac-Man's direction
        let pacmanFutureCell = {
            x: pacmanCell.x + pacmanDirection.x * 4,
            y: pacmanCell.y + pacmanDirection.y * 4
        };

        const walkableTarget = this.findWalkableTargetAlongVector(pacmanCell, pacmanFutureCell);

        if (this.path.length === 0 ||
            this.path[this.path.length - 1].x !== walkableTarget.x ||
            this.path[this.path.length - 1].y !== walkableTarget.y) {
            this.path = this.findPath(getCell(this.position), walkableTarget);
        }

        this.targetCell = walkableTarget;
    }
}

export class Inky extends Ghost {
    static name = "Inky";

    constructor(startCell, scatterCell, level) {
        super('cyan', startCell, scatterCell, level);
    }

    chase(pacmanCell, pacmanDirection, blinkyCell) {
        // 1. Find the tile two spaces ahead of Pacman
        const twoTilesAhead = {
            x: pacmanCell.x + 2 * pacmanDirection.x,
            y: pacmanCell.y + 2 * pacmanDirection.y
        };

        // 2. Draw a vector from Blinky to the target tile 
        const blinkyToTarget = {
            x: twoTilesAhead.x - blinkyCell.x,
            y: twoTilesAhead.y - blinkyCell.y
        };

        // 3. Extend the vector outward, doubling its length
        let inkyTarget = {
            x: blinkyCell.x + 2 * blinkyToTarget.x,
            y: blinkyCell.y + 2 * blinkyToTarget.y
        };

        // 4. Find a walkable cell along the vector
        const walkableTarget = this.findWalkableTargetAlongVector(blinkyCell, inkyTarget);

        // 5. Find a path to the adjusted target
        if (this.path.length === 0 ||
            this.path[this.path.length - 1].x !== walkableTarget.x ||
            this.path[this.path.length - 1].y !== walkableTarget.y) {
            this.path = this.findPath(getCell(this.position), walkableTarget);
        }

        this.targetCell = walkableTarget;   // dev visualization
    }
}

export class Clyde extends Ghost {
    static name = "Clyde";

    constructor(startCell, scatterCell, level) {
        super('orange', startCell, scatterCell, level);
    }

    chase(pacmanCell, pacmanDirection, blinkyCell) {
        let distance = this.calculateDistance(pacmanCell);
        if (distance > 8) {
            // Target Pac-Man directly
            if (this.path.length === 0 ||
                this.path[this.path.length - 1].x !== pacmanCell.x ||
                this.path[this.path.length - 1].y !== pacmanCell.y) {
                this.path = this.findPath(getCell(this.position), pacmanCell);
            }

            this.targetCell = pacmanCell;   // dev visualization
        } else {
            this.scatter();
        }

    }
}