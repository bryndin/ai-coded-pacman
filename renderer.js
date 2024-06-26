import { CELL_SIZE, DIRECTIONS } from "./constants.js";
import { Ghost, FRIGHTENED_MODE } from './ghost.js';
import { GAME_STATES } from './game.js';
import Level from './level.js';
import { Pellet, PowerPellet } from './pellet.js';

const HEADER_HEIGHT = 3 * CELL_SIZE;

export class Renderer {
    constructor(cellWidth, cellHeight) {
        this.canvasWidth = cellWidth * CELL_SIZE;
        this.canvasHeight = cellHeight * CELL_SIZE;

        this.showScatterCells = false;
        this.showGhostTargets = false;

        createCanvas(this.canvasWidth, this.canvasHeight + HEADER_HEIGHT);
        angleMode(RADIANS);
        noStroke();
        // strokeWeight(1);
    }

    draw(game) {
        background(0);
        this.drawScore(game.score);
        this.drawLives(game.lives);

        translate(0, HEADER_HEIGHT);

        Renderer.drawLevel(game.getCurrentLevel());

        Renderer.drawPacman(game.pacman.position, game.pacman.direction);
        for (const ghost of game.ghosts.values()) {
            Renderer.drawGhost(ghost.position, ghost.color, ghost.mode);

            if (this.showScatterCells) {
                Renderer.drawScatterCells(ghost.scatterCell, ghost.color);
            }

            if (this.showGhostTargets) {
                Renderer.drawGhostTargets(ghost.targetCell, ghost.color);
            }
        }

        if (game.state === GAME_STATES.WAITING) {
            this.displayWaitForKeyPressMessage();
        }

    }

    static drawLevel(level) {
        for (let y = 0; y < level.height; y++) {
            for (let x = 0; x < level.width; x++) {
                switch (level.layout[y][x]) {
                    case Level.WALL:
                        Renderer.drawWall(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
                        break;
                    case Level.PELLET:
                        Renderer.drawPellet(x * CELL_SIZE, y * CELL_SIZE);
                        break;
                    case Level.POWER_PELLET:
                        Renderer.drawPowerPellet(x * CELL_SIZE, y * CELL_SIZE);
                        break;
                }
            }
        }
    }

    // pos is a center of the cell
    static drawPacman(pos, dir) {
        const size = CELL_SIZE;

        let angle = 0;
        if (dir === DIRECTIONS.LEFT) angle = PI; // Left
        else if (dir === DIRECTIONS.UP) angle = 3 * PI / 2; // Up
        else if (dir === DIRECTIONS.DOWN) angle = PI / 2; // Down

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        fill(255, 255, 0);
        arc(0, 0, size, size, PI / 6, TWO_PI - PI / 6, PIE);
        pop();
    }

    // pos is a center of the cell
    static drawGhost(pos, color, mode) { // Add mode parameter
        const size = Ghost.size;

        push();

        translate(pos.x, pos.y);

        if (mode === FRIGHTENED_MODE) { // Check for frightened mode
            // Draw frightened ghost
            fill('blue');
            arc(0, 0, size, size, 0, 2 * PI); // Blue circle
            fill('white');
            ellipse(-size / 4, -size / 6, size / 5, size / 3); // White eyes
            ellipse(size / 4, -size / 6, size / 5, size / 3);
            fill('red');
            triangle(-size / 4, size / 4, 0, size / 2, size / 4, size / 4); // Red mouth

        } else {
            // Draw normal ghost
            const endAngle = 3 * PI;
            const skirtHeight = size / 5;
            const skirtShiftY = size / 2 - skirtHeight;

            // Draw the body
            fill(color);
            arc(0, 0, size, size, PI, 2 * PI, CHORD);
            rect(-size / 2, 0, size, size / 2 - skirtHeight);

            // Draw the eyes
            fill(255); // White eyes
            const eyeOffset = size / 5;
            const eyeSize = size / 6;
            ellipse(-eyeOffset, -eyeOffset, eyeSize, eyeSize);
            ellipse(eyeOffset, -eyeOffset, eyeSize, eyeSize);

            // Draw the bottom "skirt"
            fill(color);
            beginShape();
            for (let x = 0; x <= size; x++) {
                let y = skirtShiftY + Math.abs(skirtHeight * sin(x * endAngle / size));
                vertex(x - size / 2, y);
            }
            endShape();
        }

        pop();
    }
    // x,y are the top-left corner
    static drawWall(x, y) {
        const size = CELL_SIZE;

        fill(220);
        rect(x, y, size, size);
    }

    static drawPellet(x, y) {
        const size = Pellet.size;

        fill(255, 255, 0);  // yellow
        circle(x + CELL_SIZE / 2, y + CELL_SIZE / 2, size);
    }

    static drawPowerPellet(x, y) {
        const size = PowerPellet.size;

        fill(255, 255, 0);  // yellow
        circle(x + CELL_SIZE / 2, y + CELL_SIZE / 2, size);
    }

    drawScore(score) {
        textSize(20);
        fill(255);
        text("Score: " + score, 10, 20);
    }

    drawLives(lives) {
        textSize(20);
        fill(255);
        text("Lives: " + lives, this.canvasWidth - 80, 20);
    }

    displayWaitForKeyPressMessage() {
        push();
        stroke("black");
        strokeWeight(7);
        fill("red");
        textAlign(CENTER);
        textSize(32);
        text("Press any key to continue", this.canvasWidth / 2, this.canvasHeight / 2);
        pop();
    }

    static drawScatterCells(pos, color) {
        const size = CELL_SIZE;

        fill(color);
        rect(pos.x * CELL_SIZE, pos.y * CELL_SIZE, size, size);
    }

    static drawGhostTargets(pos, color) {
        const size = CELL_SIZE;

        push();

        translate(pos.x * CELL_SIZE, pos.y * CELL_SIZE);

        stroke(color);
        strokeWeight(4);

        // Draw diagonal cross
        line(0, 0, size, size);
        line(size, 0, 0, size);

        pop()
    }
}

// Helper functions

export function getCell(canvasPosition) {
    return { x: Math.floor(canvasPosition.x / CELL_SIZE), y: Math.floor(canvasPosition.y / CELL_SIZE) };
};
