import Level from './level.js';
import Pacman from './pacman.js';
import { Blinky, Pinky, Inky, Clyde, FRIGHTENED_MODE, SCATTER_MODE, CHASE_MODE } from './ghost.js';
import { Pellet, PowerPellet } from './pellet.js';
import { CELL_SIZE, getCell } from './renderer.js';

// Import level data from individual files
import level1 from './levels/1.js';

class Game {
    static PELLET_SCORE = 1;
    static GHOST_SCORE = 200; // Score for eating a ghost
    static FRIGHTENED_MODE_DURATION = 7000; // 7 seconds

    static SCATTER_MODE_DURATION = 7000; // 7 seconds
    static CHASE_MODE_DURATION = 20000; // 20 seconds

    static states = {
        START: "START",
        WAITING: "WAITING",
        RUNNING: "RUNNING",
        PACMAN_DEAD: "PACMAN_DEAD",
        LEVEL_COMPLETE: "LEVEL_COMPLETE",
        PAUSED: "PAUSED",
        GAME_OVER: "GAME_OVER",
    };

    constructor() {
        this.levels = [
            new Level(
                level1.layout,
                level1.pacman,
                new Map([
                    ["Blinky", level1.blinky],
                    ["Pinky", level1.pinky],
                    ["Inky", level1.inky],
                    ["Clyde", level1.clyde]
                ]),
            )
        ];
        this.score = 0;
        this.lives = 3;
        this.state = Game.states.START;

        this.currentLevelIndex = 0;
        this.pacman = null;
        this.ghosts = new Map();
        this.frightenedModeTimer = null; // Timer for frightened mode
        this.scatterChaseModeTimer = null; // Timer for scatter and chase modes

        this.isKeypress = false;
    }

    getCurrentLevel() {
        return this.levels[this.currentLevelIndex];
    }

    setState(newState) {
        console.log(`Game State Changed from ${this.state} to ${newState}`);
        this.state = newState;
    }

    stopAllTimers() {
        if (this.frightenedModeTimer) {
            clearTimeout(this.frightenedModeTimer);
            this.frightenedModeTimer = null;
        }
        if (this.scatterChaseModeTimer) {
            clearTimeout(this.scatterChaseModeTimer);
            this.scatterChaseModeTimer = null;
        }
    }

    main() {
        switch (this.state) {
            case Game.states.START:
                this.setLevel(this.currentLevelIndex);
                this.setState(Game.states.WAITING);
                break;

            case Game.states.WAITING:
                if (this.isKeypress) {
                    this.startScatterChaseModeCycle();
                    this.isKeypress = false;
                    this.setState(Game.states.RUNNING);
                }
                return;

            case Game.states.RUNNING:
                const level = this.getCurrentLevel();
                this.pacman.move(level.layout);

                const pacmanCell = getCell(this.pacman.position);

                for (const ghost of this.ghosts.values()) {
                    ghost.update(
                        pacmanCell,
                        this.pacman.direction,
                        getCell(this.ghosts.get("Blinky").position)
                    );
                }

                // Check for Pacman collision with pellets in two neighboring cells
                for (let dx = 0; dx <= 1; dx++) {
                    for (let dy = 0; dy <= 1; dy++) {
                        const cellX = pacmanCell.x + dx;
                        const cellY = pacmanCell.y + dy;
                        if (this.isPelletCollision(cellX, cellY)) {
                            this.score++;
                            level.removePellet(cellX, cellY);

                            if (level.pelletCount === 0) {
                                this.setState(Game.states.LEVEL_COMPLETE);
                            }
                        }

                        if (this.isPowerPelletCollision(cellX, cellY)) {
                            level.removePowerPellet(cellX, cellY);
                            this.activateFrightenedMode();
                        }
                    }
                }

                const collidedGhost = this.checkPacmanGhostCollision();
                if (collidedGhost) {
                    if (collidedGhost.mode === FRIGHTENED_MODE) {
                        this.eatGhost(collidedGhost);
                    } else {
                        this.setState(Game.states.PACMAN_DEAD);
                        return;
                    }
                }

                if (this.isLevelComplete()) {
                    this.setState(Game.states.LEVEL_COMPLETE);
                }

                if (this.checkGameCompletion()) {
                    this.setState(Game.states.GAME_OVER);
                    // TODO: reset all levels, as they could have removed pellets.
                }

                break;

            case Game.states.PACMAN_DEAD:
                // Handle Pacman death animation and options (restart, game over)
                this.stopAllTimers();

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
                this.stopAllTimers();

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
                this.stopAllTimers();
                console.log("Game Over!");
                break;
        }
    }

    activateFrightenedMode() {
        for (const ghost of this.ghosts.values()) {
            ghost.setMode(FRIGHTENED_MODE);
        }
        if (this.frightenedModeTimer) {
            clearTimeout(this.frightenedModeTimer);
        }
        if (this.scatterChaseModeTimer) {
            clearTimeout(this.scatterChaseModeTimer);
        }
        this.frightenedModeTimer = setTimeout(() => {
            this.deactivateFrightenedMode();
        }, Game.FRIGHTENED_MODE_DURATION);
        console.log(`Ghosts ${FRIGHTENED_MODE} for ${Game.FRIGHTENED_MODE_DURATION / 1000}s`);
    }

    deactivateFrightenedMode() {
        for (const ghost of this.ghosts.values()) {
            ghost.setMode(SCATTER_MODE);
        }
        this.frightenedModeTimer = null;
        this.startScatterChaseModeCycle();
    }

    startScatterChaseModeCycle() {
        let scatterMode = true;

        const switchModes = () => {
            scatterMode = !scatterMode;
            for (const ghost of this.ghosts.values()) {
                ghost.setMode(scatterMode ? SCATTER_MODE : CHASE_MODE);
            }
            const duration = scatterMode ? Game.SCATTER_MODE_DURATION : Game.CHASE_MODE_DURATION;
            this.scatterChaseModeTimer = setTimeout(switchModes, duration);
            console.log(`Ghosts ${scatterMode ? SCATTER_MODE : CHASE_MODE} for ${duration / 1000}s`);
        };

        if (this.scatterChaseModeTimer) {
            clearTimeout(this.scatterChaseModeTimer);
        }

        switchModes();
    }

    eatGhost(ghost) {
        this.score += Game.GHOST_SCORE;
        ghost.position = { x: (ghost.startCell.x + 0.5) * CELL_SIZE, y: (ghost.startCell.y + 0.5) * CELL_SIZE };
        ghost.setMode(SCATTER_MODE);
    }

    checkGameCompletion() {
        return false;
    }

    checkPacmanGhostCollision() {
        for (const ghost of this.ghosts.values()) {
            if (checkForOverlap(this.pacman.position, ghost.position, this.pacman.size, ghost.size)) {
                return ghost;
            }
        }

        return null;
    }

    isPelletCollision(cellX, cellY) {
        const level = this.getCurrentLevel();

        // Check if the cell coordinates are within the layout limits
        if (!level.isOutOfBounds(cellX, cellY) && level.layout[cellY][cellX] === Level.PELLET) {
            // Compute its collision box in canvas coordinates
            const pellet = new Pellet({ x: cellX * CELL_SIZE, y: cellY * CELL_SIZE });
            return checkForOverlap(this.pacman.position, pellet.position, this.pacman.size, Pellet.size);
        }
        return false;
    }

    isPowerPelletCollision(cellX, cellY) {
        const level = this.getCurrentLevel();

        // Check if the cell coordinates are within the layout limits
        if (!level.isOutOfBounds(cellX, cellY) && level.layout[cellY][cellX] === Level.POWER_PELLET) {
            // Compute its collision box in canvas coordinates
            const pellet = new PowerPellet({ x: cellX * CELL_SIZE, y: cellY * CELL_SIZE });
            return checkForOverlap(this.pacman.position, pellet.position, this.pacman.size, PowerPellet.size);
        }
        return false;
    }

    isLevelComplete() {
        const level = this.getCurrentLevel();
        return level.pelletCount === 0;
    }

    setLevel(n) {
        this.currentLevelIndex = n;

        if (this.currentLevelIndex >= this.levels.length) {
            throw new Error(`Invalid level index: Level ${n} doesn't exist`);
        }

        const level = this.getCurrentLevel();
        this.pacman = new Pacman(level.pacmanStart, CELL_SIZE, 2);

        this.ghosts.set(
            Blinky.name,
            new Blinky(level.ghostStarts.get(Blinky.name).start, level.ghostStarts.get(Blinky.name).scatter, level)
        );
        this.ghosts.set(
            Pinky.name,
            new Pinky(level.ghostStarts.get(Pinky.name).start, level.ghostStarts.get(Pinky.name).scatter, level)
        );
        this.ghosts.set(
            Inky.name,
            new Inky(level.ghostStarts.get(Inky.name).start, level.ghostStarts.get(Inky.name).scatter, level)
        );
        this.ghosts.set(
            Clyde.name,
            new Clyde(level.ghostStarts.get(Clyde.name).start, level.ghostStarts.get(Clyde.name).scatter, level)
        );
    }
}

function checkForOverlap(obj1Position, obj2Position, obj1Size, obj2Size) {
    return (
        (obj1Position.x < obj2Position.x + obj2Size && obj1Position.x + obj1Size > obj2Position.x) &&
        (obj1Position.y < obj2Position.y + obj2Size && obj1Position.y + obj1Size > obj2Position.y)
    );
}

export default Game;
