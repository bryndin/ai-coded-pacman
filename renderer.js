import Level from './level.js';

const CELL_SIZE = 16;

class Renderer {
    constructor(cellWidth, cellHeight) {
        this.canvasWidth = cellWidth * CELL_SIZE;
        this.canvasHeight = cellHeight * CELL_SIZE;

        createCanvas(this.canvasWidth, this.canvasHeight);
        angleMode(RADIANS);
    }

    draw(game) {
        background(0);
        this.drawScore(game.score);
        this.drawLives(game.lives);
        Renderer.drawLevel(game.getCurrentLevel());

        Renderer.drawPacman(game.pacman.position, game.pacman.size, game.pacman.direction);
        for (const ghost of game.ghosts) {
            Renderer.drawGhost(ghost.position, ghost.size, ghost.color);
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
                        Renderer.drawPellet(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE / 3);
                        break;
                }
            }
        }
    }

    static drawPacman(pos, size, dir) {
        function getAngle(dir) {
            if (dir.x > 0) {
                return 0;
            } else if (dir.x < 0) {
                return PI;
            } else if (dir.y > 0) {
                return PI / 2;
            } else {
                return -PI / 2;
            }
        }

        fill(255, 255, 0);
        ellipse(pos.x + CELL_SIZE / 2, pos.y + CELL_SIZE / 2, size, size);
        const angle = getAngle(dir);
        fill(0);
        arc(pos.x + CELL_SIZE / 2, pos.y + CELL_SIZE / 2, size / 2, size / 2, angle - PI / 7, angle + PI / 7);
    }

    static drawGhost(pos, size, color) {
        push(); // Save current drawing style

        translate(pos.x, pos.y); // Move to the center of the ghost

        // Draw the body (semicircle)

        fill(color);
        arc(0, 0, size, size, PI, 2*PI, CHORD);

        // Draw the eyes
        fill(255); // White eyes
        const eyeOffset = size / 5;
        const eyeSize = size / 6;
        ellipse(-eyeOffset, -eyeOffset, eyeSize, eyeSize);
        ellipse(eyeOffset, -eyeOffset, eyeSize, eyeSize);

        // Draw the bottom "skirt"
        fill(color);

        // TODO: fix the code for ghost skirt
        rect(-size/2, 0, size, size/2);

        // Draw the bottom "skirt" - Corrected Logic
        // beginShape();
        // for (let i = 0; i <= 8; i++) {
        //     const skirtHeight = size / 3; // Adjust skirt height as needed
        //     let angle = map(i, 0, 8, PI, TWO_PI);
        //     let x = (size / 2) * cos(angle);
        //     // Create a wavy pattern below the body that slopes down at the edges
        //     let y = skirtHeight * sin(angle * 3) + size / 2 + skirtHeight / 2;
        //     vertex(x, y);
        // }
        // endShape(CLOSE);

        pop(); // Restore previous drawing style
    }

    // static drawGhost(pos, size, color) {
    //     fill(color);
    //     ellipse(pos.x, pos.y + CELL_SIZE / 2, size, size);
    //     triangle(pos.x + CELL_SIZE / 3, pos.y + CELL_SIZE / 3, pos.x + CELL_SIZE / 2, pos.y, pos.x + CELL_SIZE - CELL_SIZE / 3, pos.y + CELL_SIZE / 3);
    //     fill(0);
    //     ellipse(pos.x + CELL_SIZE / 3, pos.y + CELL_SIZE / 3, size / 5, size / 5);
    //     ellipse(pos.x + CELL_SIZE - CELL_SIZE / 3, pos.y + CELL_SIZE / 3, size / 5, size / 5);
    // }

    static drawWall(x, y, size) {
        fill(220);
        rect(x, y, size, size);
    }

    static drawPellet(x, y, size) {
        // Set fill color to yellow
        fill(255, 255, 0);
        // Draw a circle at the provided coordinates
        ellipse(x + CELL_SIZE / 2, y + CELL_SIZE / 2, size, size);
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
}

export default Renderer;