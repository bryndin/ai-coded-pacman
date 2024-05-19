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

        strokeWeight(0);
        translate(pos.x, pos.y); // Move to the center of the ghost

        const endAngle = 3*PI;
        const skirtHeight = size/5;
        const skirtShiftY = size/2 - skirtHeight;

        // Draw the body
        fill(color);
        arc(0, 0, size, size, PI, 2*PI, CHORD);
        rect(-size/2, 0, size, size/2 - skirtHeight);

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
          vertex(x-size/2, y);
        }
        endShape();
      
        pop(); // Restore previous drawing style
    }

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