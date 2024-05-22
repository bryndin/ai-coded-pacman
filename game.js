import Level from './level.js';
import Pacman from './pacman.js';
import { Blinky, Pinky, Inky, Clyde } from './ghost.js';
import Pellet from './pellet.js';
import { CELL_SIZE, getCell } from './renderer.js';

// Import level data from individual files
import level1 from './levels/1.js';

class Game {
    static PELLET_SCORE = 1;

    static states = {
        START: "START",
        WAITING: "WAITING",
        RUNNING: "RUNNING",
        PACMAN_DEAD: "PACMAN_DEAD",
        LEVEL_COMPLETE: "LEVEL_COMPLETE",
        PAUSED: "PAUSED",
        GAME_OVER: "GAME_OVER",
        POWERUP: "POWERUP",
    };

    constructor() {
        this.levels = [
            new Level(level1.layout, level1.pacman, level1.blinky, level1.pinky, level1.inky, level1.clyde),
        ];
        this.score = 0;
        this.lives = 3;
        this.state = Game.states.START;

        this.currentLevelIndex = 0;
        this.pacman = null;
        this.ghosts = [];
    }

    getCurrentLevel() {
        return this.levels[this.currentLevelIndex];
    }

    setState(newState) {
        console.log(`Game State Changed from ${this.state} to ${newState}`);
        this.state = newState;
    }

    main() {
        switch (this.state) {
            case Game.states.START:
                this.setLevel(this.currentLevelIndex);
                this.setState(Game.states.WAITING);
                break;

            case Game.states.WAITING:
                /* Waiting for a key press to switch to RUNNING, see keyPressed() */
                return;
                break;

            case Game.states.RUNNING:
                const level = this.getCurrentLevel();
                this.pacman.move(level.layout);

                // Check for Pacman collision with pellets in four neighboring cells
                const pacmanCellX = Math.floor(this.pacman.position.x / CELL_SIZE);
                const pacmanCellY = Math.floor(this.pacman.position.y / CELL_SIZE);

                this.ghosts.forEach(ghost => ghost.update(
                    { x: pacmanCellX, y: pacmanCellY },
                    this.pacman.direction,
                    getCell(this.ghosts[2].position), // TODO: replace array with map
                ));

                for (let dx = 0; dx <= 1; dx++) {
                    for (let dy = 0; dy <= 1; dy++) {
                        const cellX = pacmanCellX + dx;
                        const cellY = pacmanCellY + dy;
                        if (this.checkPelletCollision(cellX, cellY)) {
                            this.score++;
                            level.removePellet(cellX, cellY);

                            if (level.pelletCount === 0) {
                                this.setState(Game.states.LEVEL_COMPLETE);
                            }
                        }
                    }
                }

                if (this.checkPacmanGhostCollision()) {
                    this.setState(Game.states.PACMAN_DEAD);
                    return;
                }

                if (this.isLevelComplete()) {
                    this.setState(Game.states.LEVEL_COMPLETE);
                    // TODO: add more logic here
                }

                if (this.checkGameCompletion()) {
                    this.setState(Game.states.GAME_OVER);
                    // TODO: reset all levels, as they could have removed pellets.
                }

                break;

            case Game.states.PACMAN_DEAD:
                // Handle Pacman death animation and options (restart, game over)
                this.lives--;
                if (this.lives === 0) {
                    this.setState(Game.states.GAME_OVER);
                } else {
                    // Reset positions
                    this.setLevel(this.currentLevelIndex);
                    this.setState(Game.states.START);
                }
                break;

            case Game.states.LEVEL_COMPLETE:
                // Handle level completion logic (restart, next level)
                // TODO: add more logic here.
                this.currentLevelIndex++;

                if (this.currentLevelIndex < this.levels.length) {
                    this.setLevel(this.currentLevelIndex);
                    this.setState(Game.states.START);
                } else {
                    this.setState(Game.states.GAME_OVER);
                }
                break;

            case Game.states.PAUSED:
                // Pause game loop and user interaction
                break;

            case Game.states.GAME_OVER:
                // Display final score and options (restart, exit)
                console.log("Game Over!");
                break;
        }
    }

    checkGameCompletion() {
        return false;
    }

    checkPacmanGhostCollision() {
        for (const ghost of this.ghosts) {
            if (checkForOverlap(this.pacman.position, ghost.position, this.pacman.size, ghost.size)) {
                return ghost;
            }
        }

        return null;
    }

    checkPelletCollision(cellX, cellY) {
        const level = this.getCurrentLevel();

        // Check if the cell coordinates are within the layout limits
        if ((0 <= cellX && cellX < level.layout[0].length) && (0 <= cellY && cellY < level.layout.length) && level.layout[cellY][cellX] === Level.PELLET) {
            // Compute its collision box in canvas coordinates
            const pellet = new Pellet({ x: cellX * CELL_SIZE, y: cellY * CELL_SIZE });
            return checkForOverlap(this.pacman.position, pellet.position, this.pacman.size, pellet.size);
        }
        return false;
    }

    isLevelComplete() {
        // Implement your logic to check if all pellets are eaten
        return false;
    }

    setLevel(n) {
        this.currentLevelIndex = n;

        if (this.currentLevelIndex >= this.levels.length) {
            throw new Error(`Invalid level index: Level ${n} doesn't exist`);
        }

        const level = this.getCurrentLevel();
        this.pacman = new Pacman(level.pacmanStart, CELL_SIZE, 2);

        this.ghosts = [
            new Blinky(level.blinkyStart.start, level.blinkyStart.scatter, level),
            new Pinky(level.pinkyStart.start, level.pinkyStart.scatter, level),
            new Inky(level.inkyStart.start, level.inkyStart.scatter, level),
            new Clyde(level.clydeStart.start, level.clydeStart.scatter, level),
        ];
    }
}

function checkForOverlap(obj1Position, obj2Position, obj1Size, obj2Size) {
    return (
        (obj1Position.x < obj2Position.x + obj2Size && obj1Position.x + obj1Size > obj2Position.x) &&
        (obj1Position.y < obj2Position.y + obj2Size && obj1Position.y + obj1Size > obj2Position.y)
    );
}

export default Game;