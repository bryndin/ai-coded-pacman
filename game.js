import { CELL_SIZE } from "./constants.js";
import Level from './level.js';
import Pacman from './pacman.js';
import { Blinky, Pinky, Inky, Clyde, FRIGHTENED_MODE, SCATTER_MODE, CHASE_MODE } from './ghost.js';
import { Pellet, PowerPellet } from './pellet.js';
import { getCell } from './renderer.js';

// Import level data from individual files
import level1 from './levels/1.js';

export const GAME_STATES = {
    START: "START",
    WAITING: "WAITING",
    RUNNING: "RUNNING",
    PACMAN_DEAD: "PACMAN_DEAD",
    LEVEL_COMPLETE: "LEVEL_COMPLETE",
    PAUSED: "PAUSED",
    GAME_OVER: "GAME_OVER",
};

const PELLET_SCORE = 1;
const GHOST_SCORE = 200; // Score for eating a ghost
const FRIGHTENED_MODE_DURATION = 7000; // 7 seconds
const SCATTER_MODE_DURATION = 7000; // 7 seconds
const CHASE_MODE_DURATION = 20000; // 20 seconds

export class Game {
    constructor() {
        this.levels = [
            new Level(level1.layout, level1.pacman, new Map([
                ["Blinky", level1.blinky],
                ["Pinky", level1.pinky],
                ["Inky", level1.inky],
                ["Clyde", level1.clyde]
            ])),
        ];
        this.currentLevelIndex = 0;
        this.score = 0;
        this.lives = 3;
        this.state = GAME_STATES.START;

        this.pacman = null;
        this.ghosts = new Map();

        this.frightenedModeTimer = null;
        this.scatterChaseModeTimer = null;

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
            case GAME_STATES.START:
                this.setLevel(this.currentLevelIndex);
                this.setState(GAME_STATES.WAITING);
                break;

            case GAME_STATES.WAITING:
                if (this.isKeypress) {
                    this.startScatterChaseModeCycle();
                    this.isKeypress = false;
                    this.setState(GAME_STATES.RUNNING);
                }
                return;

            case GAME_STATES.RUNNING:
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
                            this.score += PELLET_SCORE;
                            level.removePellet(cellX, cellY);

                            if (level.pelletCount === 0) {
                                this.setState(GAME_STATES.LEVEL_COMPLETE);
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
                        this.setState(GAME_STATES.PACMAN_DEAD);
                        return;
                    }
                }

                if (this.isLevelComplete()) {
                    this.setState(GAME_STATES.LEVEL_COMPLETE);
                }

                if (this.checkGameCompletion()) {
                    this.setState(GAME_STATES.GAME_OVER);
                    // TODO: reset all levels, as they could have removed pellets.
                }

                break;

            case GAME_STATES.PACMAN_DEAD:
                // Handle Pacman death animation and options (restart, game over)
                this.stopAllTimers();

                this.lives--;
                if (this.lives === 0) {
                    this.setState(GAME_STATES.GAME_OVER);
                } else {
                    // Reset positions
                    this.setLevel(this.currentLevelIndex);
                    this.setState(GAME_STATES.START);
                }
                break;

            case GAME_STATES.LEVEL_COMPLETE:
                // Handle level completion logic (restart, next level)
                // TODO: add more logic here.
                this.stopAllTimers();

                this.currentLevelIndex++;
                if (this.currentLevelIndex < this.levels.length) {
                    this.setLevel(this.currentLevelIndex);
                    this.setState(GAME_STATES.START);
                } else {
                    this.setState(GAME_STATES.GAME_OVER);
                }
                break;

            case GAME_STATES.PAUSED:
                // Pause game loop and user interaction
                break;

            case GAME_STATES.GAME_OVER:
                // Display final score and options (restart, exit)
                this.stopAllTimers();
                console.log("Game Over!");
                break;
        }
    }

    activateFrightenedMode() {
        this.ghosts.forEach(ghost => ghost.setMode(FRIGHTENED_MODE));

        if (this.frightenedModeTimer) {
            clearTimeout(this.frightenedModeTimer);
        }
        if (this.scatterChaseModeTimer) {
            clearTimeout(this.scatterChaseModeTimer);
        }
        this.frightenedModeTimer = setTimeout(() => {
            this.deactivateFrightenedMode();
        }, FRIGHTENED_MODE_DURATION);
        console.log(`Ghosts ${FRIGHTENED_MODE} for ${FRIGHTENED_MODE_DURATION / 1000}s`);
    }

    deactivateFrightenedMode() {
        this.ghosts.forEach(ghost => ghost.setMode(SCATTER_MODE));
        this.frightenedModeTimer = null;
        this.startScatterChaseModeCycle();
    }

    startScatterChaseModeCycle() {
        let scatterMode = true;

        const switchModes = () => {
            scatterMode = !scatterMode;
            this.ghosts.forEach(ghost => ghost.setMode(scatterMode ? SCATTER_MODE : CHASE_MODE));

            const duration = scatterMode ? SCATTER_MODE_DURATION : CHASE_MODE_DURATION;
            this.scatterChaseModeTimer = setTimeout(switchModes, duration);

            console.log(`Ghosts ${scatterMode ? SCATTER_MODE : CHASE_MODE} for ${duration / 1000}s`);
        };

        if (this.scatterChaseModeTimer) {
            clearTimeout(this.scatterChaseModeTimer);
        }

        switchModes();
    }

    eatGhost(ghost) {
        this.score += GHOST_SCORE;
        ghost.position = { x: (ghost.startCell.x + 0.5) * CELL_SIZE, y: (ghost.startCell.y + 0.5) * CELL_SIZE };
        ghost.setMode(SCATTER_MODE);
    }

    checkGameCompletion() {
        return false;
    }

    checkPacmanGhostCollision() {
        for (const ghost of this.ghosts.values()) {
            if (this.pacman.checkCollision(ghost)) {
                return ghost;
            }
        }
        return null;
    }

    isPelletCollision(cellX, cellY) {
        const level = this.getCurrentLevel();

        if (!level.isOutOfBounds(cellX, cellY) && level.layout[cellY][cellX] === Level.PELLET) {
            const pellet = new Pellet({ x: cellX, y: cellY });
            return this.pacman.checkCollision(pellet);
        }
        return false;
    }

    isPowerPelletCollision(cellX, cellY) {
        const level = this.getCurrentLevel();

        if (!level.isOutOfBounds(cellX, cellY) && level.layout[cellY][cellX] === Level.POWER_PELLET) {
            const powerPellet = new PowerPellet({ x: cellX, y: cellY });
            return this.pacman.checkCollision(powerPellet);
        }
        return false;
    }

    isLevelComplete() {
        const level = this.getCurrentLevel();
        return level.pelletCount === 0;
    }

    setLevel(levelIndex) {
        this.currentLevelIndex = levelIndex;

        if (this.currentLevelIndex >= this.levels.length) {
            throw new Error(`Invalid level index: Level ${levelIndex} doesn't exist`);
        }

        const level = this.getCurrentLevel();
        this.pacman = new Pacman(level.pacmanStart, 2);

        this.ghosts = new Map([
            [Blinky.name, new Blinky(level.ghostStarts.get(Blinky.name).start, level.ghostStarts.get(Blinky.name).scatter, level)],
            [Pinky.name, new Pinky(level.ghostStarts.get(Pinky.name).start, level.ghostStarts.get(Pinky.name).scatter, level)],
            [Inky.name, new Inky(level.ghostStarts.get(Inky.name).start, level.ghostStarts.get(Inky.name).scatter, level)],
            [Clyde.name, new Clyde(level.ghostStarts.get(Clyde.name).start, level.ghostStarts.get(Clyde.name).scatter, level)],
        ]);
    }
}
