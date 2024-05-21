import Level from "./level.js";
import { getCell, CELL_SIZE } from "./renderer.js";

const SCATTER_MODE = 'scatter';
const CHASE_MODE = 'chase';

class Ghost {
    constructor(name, color, startCell, scatterCell, layout) {
        this.name = name;
        this.color = color;
        this.scatterCell = scatterCell;
        this.mode = CHASE_MODE;
        this.position = { x: startCell.x * CELL_SIZE, y: startCell.y * CELL_SIZE };
        this.direction = { x: 0, y: 0 }; // Initialize starting direction
        this.speed = 2;
        this.path = []; // Store the calculated path
        this.layout = layout;
        this.size = CELL_SIZE;
        this.targetCell = startCell;
    }

    update(pacmanCell, pacmanDirection) {
        if (this.mode === SCATTER_MODE) {
            this.scatter();
        } else {
            this.chase(pacmanCell, pacmanDirection);
        }
        this.move();
    }

    scatter() {
        const scatterX = (this.scatterCell.x + 0.5) * CELL_SIZE;
        const scatterY = (this.scatterCell.y + 0.5) * CELL_SIZE;

        if (this.path.length === 0 && (this.position.x !== scatterX && this.position.y !== scatterY)) {
            this.path = this.findPath(getCell(this.position), this.scatterCell);
        }
    }

    chase(pacmanCell, pacmanDirection) {
        // Chase behavior depends on the specific ghost
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
    }

    // Helper functions

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

            if (newX >= 0 && newY >= 0 && newX < this.layout[0].length && newY < this.layout.length && this.layout[newY][newX] !== Level.WALL) {
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
    constructor(startCell, scatterCell, layout) {
        super('Blinky', 'red', startCell, scatterCell, layout);
    }

    chase(pacmanCell, pacmanDirection) {
        // Directly target Pac-Man's position

        // Calculate the path only if it's not already calculated or the target has moved
        if (this.path.length === 0 ||
            this.path[this.path.length - 1].x !== pacmanCell.x ||
            this.path[this.path.length - 1].y !== pacmanCell.y) {
            this.path = this.findPath(getCell(this.position), pacmanCell);
        }
    }
}

export class Pinky extends Ghost {
    constructor(startCell, scatterCell, layout) {
        super('Pinky', 'pink', startCell, scatterCell, layout);
    }

    chase(pacmanCell, pacmanDirection) {
        // Target 4 tiles ahead of Pac-Man's direction
        let targetCell = {
            x: pacmanCell.x + pacmanDirection.x * 4,
            y: pacmanCell.y + pacmanDirection.y * 4
        };
        // this.direction = this.calculateDirection(targetCell);

        if (this.path.length === 0 ||
            this.path[this.path.length - 1].x !== pacmanCell.x ||
            this.path[this.path.length - 1].y !== pacmanCell.y) {
            this.path = this.findPath(getCell(this.position), targetCell);
        }
    }
}

export class Inky extends Ghost {
    constructor(startCell, scatterCell, layout) {
        super('Inky', 'cyan', startCell, scatterCell, layout);
    }

    chase(pacmanCell, pacmanDirection) {
        // Target based on Pac-Man's position and Blinky's position

        // let offset = {
        //     x: pacmanCell.x + pacmanDirection.x * 2,
        //     y: pacmanCell.y + pacmanDirection.y * 2
        // };
        // let target = {
        //     x: 2 * offset.x - this.position.x,
        //     y: 2 * offset.y - this.position.y
        // };
        // this.direction = this.calculateDirection(target);
    }
}

export class Clyde extends Ghost {
    constructor(startCell, scatterCell, layout) {
        super('Clyde', 'orange', startCell, scatterCell, layout);

        this.lastMode = this.mode;
    }

    chase(pacmanCell, pacmanDirection) {
        let distance = this.calculateDistance(pacmanCell);
        if (distance > 8) {
            // Target Pac-Man directly
            if (this.path.length === 0 ||
                this.path[this.path.length - 1].x !== pacmanCell.x ||
                this.path[this.path.length - 1].y !== pacmanCell.y) {
                this.path = this.findPath(getCell(this.position), pacmanCell);
            }

            this.lastMode = CHASE_MODE;
        } else {
            // Scatter to the bottom left corner
            if (this.lastMode === CHASE_MODE) {
                this.path = [];
            }
            this.scatter();
            this.lastMode = SCATTER_MODE;
        }
    }
}

Ghost.prototype.calculateDirection = function (target) {
    // Calculate direction towards target
    let dx = target.x - this.position.x;
    let dy = target.y - this.position.y;
    return { x: Math.sign(dx), y: Math.sign(dy) };
};
