import { CELL_SIZE } from "./renderer.js";

class Pellet {
    constructor(cellPosition) {
        this.size = CELL_SIZE / 3;
        this.position = { x: cellPosition.x + (CELL_SIZE - this.size) / 2, y: cellPosition.y + (CELL_SIZE - this.size) / 2 };
    }
}

export default Pellet;
