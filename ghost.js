import Level from "./level.js";

const CELL_SIZE = 16;

class Ghost {
    static CHASE = "chase";
    static SCATTER = "scatter";
    static FRIGHTENED = "frightened";

    constructor(startPosition, color) {
        this.position = { x: startPosition.x * CELL_SIZE, y: startPosition.y * CELL_SIZE };
        this.size = CELL_SIZE;
        this.direction = { x: 0, y: 0 };
        this.color = color;
        this.mode = "CHASE";
        this.chaseThreshold = 8; // Chasing within these cells
        this.speed = 2;

        this.path = []; // Store the calculated path
    }

    move(layout, targetPosition) {
        // Calculate the path only if it's not already calculated or the target has moved
        if (this.path.length === 0 ||
            this.path[this.path.length - 1].x !== targetPosition.x ||
            this.path[this.path.length - 1].y !== targetPosition.y) {
            this.path = this.findPath(layout, this.getCellCoordinates(), targetPosition);
        }

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

    // Helper functions

    getCellCoordinates() {
        return { x: Math.floor(this.position.x / CELL_SIZE), y: Math.floor(this.position.y / CELL_SIZE) };
    }

    moveTowardsCell(cell) {
        const targetX = cell.x * CELL_SIZE + CELL_SIZE / 2;
        const targetY = cell.y * CELL_SIZE + CELL_SIZE / 2;

        this.position.x += Math.sign(targetX - this.position.x) * Math.min(this.speed, Math.abs(targetX - this.position.x));
        this.position.y += Math.sign(targetY - this.position.y) * Math.min(this.speed, Math.abs(targetY - this.position.y));
    }

    hasReachedCellCenter(cell) {
        const cellCenterX = cell.x * CELL_SIZE + CELL_SIZE / 2;
        const cellCenterY = cell.y * CELL_SIZE + CELL_SIZE / 2;

        return Math.abs(this.position.x - cellCenterX) < this.speed &&
            Math.abs(this.position.y - cellCenterY) < this.speed;
    }
    findPath(layout, startPosition, targetPosition) {
        // Implementation of Breadth-First Search (BFS) algorithm
        const queue = [];
        const visited = new Set();
        const parents = {};

        queue.push(startPosition);
        visited.add(`${startPosition.x},${startPosition.y}`);

        while (queue.length > 0) {
            const current = queue.shift();
            if (current.x === targetPosition.x && current.y === targetPosition.y) {

                return this.reconstructPath(parents, targetPosition);
            }

            for (const neighbor of this.getNeighbors(layout, current)) {
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

    getNeighbors(layout, cell) {
        const neighbors = [];
        const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];

        for (const direction of directions) {
            const newX = cell.x + direction[0];
            const newY = cell.y + direction[1];

            if (newX >= 0 && newY >= 0 && newX < layout[0].length && newY < layout.length && layout[newY][newX] !== Level.WALL) {
                neighbors.push({ x: newX, y: newY });
            }
        }

        return neighbors;
    }

    reconstructPath(parents, targetPosition) {
        const path = [];
        let current = targetPosition;

        while (current) {
            path.unshift(current);
            const currentKey = `${current.x},${current.y}`;
            current = parents[currentKey];
        }

        return path;
    }
}

export default Ghost;