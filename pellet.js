import { Collidable } from "./collidable.js";
import { CELL_SIZE } from "./constants.js";

export class Pellet extends Collidable {
    static size = CELL_SIZE / 8;

    constructor(cell) {
        super(cell, Pellet.size);
    }
}

export class PowerPellet extends Collidable {
    static size = CELL_SIZE / 1.6;

    constructor(cell) {
        super(cell, PowerPellet.size);
    }
}
