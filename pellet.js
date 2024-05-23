import { CELL_SIZE } from "./renderer.js";

class Pellet {
    static size = CELL_SIZE / 3;

    constructor(cellPosition) {
        this.position = this.calculatePosition(cellPosition);
    }

    calculatePosition(cellPosition) {
        const offset = (CELL_SIZE - Pellet.size) / 2;
        return {
            x: cellPosition.x + offset,
            y: cellPosition.y + offset
        };
    }
}

export default Pellet;
