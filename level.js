class Level {
    static WALL = "#";
    static EMPTY = " ";
    static PELLET = ".";

    constructor(layout, pacman, blinky, pinky, inky, clyde) {
        this.layout = Level.convert(this.validate(layout));
        this.height = this.layout.length;
        this.width = this.layout[0].length;
        this.pacmanStart = pacman;
        this.blinkyStart = blinky;
        this.pinkyStart = pinky;
        this.inkyStart = inky;
        this.clydeStart = clyde;

        this.reachableCells = findReachableCells(this.layout, this.pacmanStart);
        this.pelletCount = this.countPellets();

    }

    validate(layout) {
        if (!layout || !layout.length || !layout[0].length) {
            throw new Error("Invalid level layout: Empty or missing data");
        }

        const rowLength = layout[0].length;
        for (let i = 1; i < layout.length; i++) {
            if (layout[i].length !== rowLength) {
                throw new Error("Invalid level layout: Inconsistent row lengths");
            }
        }
        return layout;
    }

    static convert(layout) {
        return layout.map(row => row.split(''));
    }

    // Count the number of pellets in the layout
    countPellets() {
        let count = 0;
        for (let row of this.layout) {
            for (let cell of row) {
                if (cell === '.') {
                    count++;
                }
            }
        }
        return count;
    }

    // Remove a pellet at the given coordinates
    removePellet(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new Error("Invalid coordinates. Pellet removal outside level bounds.");
        }

        if (this.layout[y][x] === Level.PELLET) {
            this.layout[y][x] = " ";
            this.pelletCount--;
        }
    }
}

function findReachableCells(layout, start) {
    const reachableCells = new Set();
    const queue = [start];
    const visited = new Set();

    while (queue.length > 0) {
        const { x, y } = queue.shift();
        if (visited.has(`${x},${y}`)) continue;
        visited.add(`${x},${y}`);

        if (layout[y][x] !== Level.WALL) {
            reachableCells.add({ x, y });

            for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < layout[0].length && ny >= 0 && ny < layout.length) {
                    queue.push({ x: nx, y: ny });
                }
            }
        }
    }

    return reachableCells;
}

export default Level;
