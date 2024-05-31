import { CELL_SIZE } from "./constants.js";

export class Collidable {
    constructor(cell, size) {
        this.size = size;
        this.position = this.calculateCenterPosition(cell);
    }

    calculateCenterPosition(cell) {
        return {
            x: (cell.x + 0.5) * CELL_SIZE,
            y: (cell.y + 0.5) * CELL_SIZE,
        };
    }

    checkCollision(other) {
        return (
            this.position.x - this.size / 2 < other.position.x + other.size / 2 &&
            this.position.x + this.size / 2 > other.position.x - other.size / 2 &&
            this.position.y - this.size / 2 < other.position.y + other.size / 2 &&
            this.position.y + this.size / 2 > other.position.y - other.size / 2
        );
    }
}
