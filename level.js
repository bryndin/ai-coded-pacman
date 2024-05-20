class Level {
    static WALL = "#";
    static EMPTY = " ";
    static PELLET = ".";
    static MOVABLE = new Set([this.EMPTY, this.PELLET]);

    constructor(layout, pacmanStart, ghostStarts) {
        this.layout = Level.convert(this.validate(layout));
        this.height = this.layout.length;
        this.width = this.layout[0].length;
        this.pacmanStart = pacmanStart;
        this.ghostStarts = ghostStarts;

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

export default Level;