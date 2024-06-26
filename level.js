import { DIRECTIONS } from "./constants.js";

class Level {
    static WALL = "#";
    static EMPTY = " ";
    static PELLET = ".";
    static POWER_PELLET = "O";

    constructor(layout, pacmanStart, ghostStarts) {
        this.layout = Level.convert(this.validate(layout));
        this.height = this.layout.length;
        this.width = this.layout[0].length;
        this.pacmanStart = pacmanStart;
        this.ghostStarts = ghostStarts;

        this.reachableCells = this.findReachableCells(this.pacmanStart);
        this.pelletCount = this.countPellets();
    }

    validate(layout) {
        if (!layout || !layout.length || !layout[0].length) {
            throw new Error("Invalid level layout: Layout cannot be empty.");
        }

        const rowLength = layout[0].length;
        for (let i = 1; i < layout.length; i++) {
            if (layout[i].length !== rowLength) {
                throw new Error(`Invalid level layout: Row ${i} length does not match.`);
            }
        }
        return layout;
    }

    static convert(layout) {
        return layout.map(row => row.split(''));
    }

    countPellets() {
        return this.layout.flat().filter(cell => cell === Level.PELLET).length;
    }

    removePellet(x, y) {
        if (this.isOutOfBounds(x, y)) {
            throw new Error("Invalid coordinates: Pellet removal outside level bounds.");
        }

        if (this.layout[y][x] === Level.PELLET) {
            this.layout[y][x] = Level.EMPTY;
            this.pelletCount--;
        }
    }

    removePowerPellet(x, y) {
        if (this.isOutOfBounds(x, y)) {
            throw new Error("Invalid coordinates: Power pellet removal outside level bounds.");
        }

        if (this.layout[y][x] === Level.POWER_PELLET) {
            this.layout[y][x] = Level.EMPTY;
        }
    }

    isOutOfBounds(x, y) {
        return x < 0 || x >= this.width || y < 0 || y >= this.height;
    }

    findReachableCells(start) {
        const reachableCells = new Set();
        const queue = [start];
        const visited = new Set();

        while (queue.length > 0) {
            const { x, y } = queue.shift();
            const key = `${x},${y}`;
            if (visited.has(key)) continue;
            visited.add(key);

            if (this.layout[y][x] !== Level.WALL) {
                reachableCells.add(key);

                for (const { x: dx, y: dy } of Object.values(DIRECTIONS)) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (!this.isOutOfBounds(nx, ny)) {
                        queue.push({ x: nx, y: ny });
                    }
                }
            }
        }

        return reachableCells;
    }
}

export default Level;
