import { CELL_SIZE } from "./renderer.js";

export class Pellet {
    // TODO: size must be defined by the renderer
    static size = CELL_SIZE / 8;

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

export class PowerPellet extends Pellet {
    // TODO: size must be defined by the renderer
    static size = CELL_SIZE / 1.6;

    constructor(cellPosition) {
        super(cellPosition);
    }
}
