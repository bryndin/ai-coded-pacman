import Level from './level.js';
import Pacman from './pacman.js';

class Renderer {
    static CELL_SIZE = 16;

    constructor(cellWidth, cellHeight) {
        this.canvasWidth = cellWidth * Renderer.CELL_SIZE;
        this.canvasHeight = cellHeight * Renderer.CELL_SIZE;

        createCanvas(this.canvasWidth, this.canvasHeight);
        angleMode(RADIANS);
        noStroke();
        // strokeWeight(1);
    }

    draw(game) {
        background(0);
        this.drawScore(game.score);
        this.drawLives(game.lives);
        Renderer.drawLevel(game.getCurrentLevel());

        Renderer.drawPacman(game.pacman.position, game.pacman.direction);
        for (const ghost of game.ghosts) {
            Renderer.drawGhost(ghost.position, ghost.color);
        }
    }

    static drawLevel(level) {
        for (let y = 0; y < level.height; y++) {
            for (let x = 0; x < level.width; x++) {
                switch (level.layout[y][x]) {
                    case Level.WALL:
                        Renderer.drawWall(x * Renderer.CELL_SIZE, y * Renderer.CELL_SIZE, Renderer.CELL_SIZE);
                        break;
                    case Level.PELLET:
                        Renderer.drawPellet(x * Renderer.CELL_SIZE, y * Renderer.CELL_SIZE);
                        break;
                }
            }
        }
    }

    static drawPacman(pos, dir) {
        const size = Renderer.CELL_SIZE;

        let angle = 0;
        if (dir === Pacman.LEFT) angle = PI; // Left
        else if (dir === Pacman.UP) angle = 3 * PI / 2; // Up
        else if (dir === Pacman.DOWN) angle = PI / 2; // Down

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        fill(255, 255, 0);
        arc(0, 0, size, size, PI / 6, TWO_PI - PI / 6, PIE);
        pop();
    }

    static drawGhost(pos, color) {
        const size = Renderer.CELL_SIZE;

        push(); // Save current drawing style

        translate(pos.x, pos.y); // Move to the center of the ghost

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

        pop(); // Restore previous drawing style
    }

    static drawWall(x, y) {
        const size = Renderer.CELL_SIZE;
        
        fill(220);
        rect(x, y, size, size);
    }

    static drawPellet(x, y) {
        const size = Renderer.CELL_SIZE / 3;

        fill(255, 255, 0);  // yellow
        circle(x + Renderer.CELL_SIZE / 2, y + Renderer.CELL_SIZE / 2, size);
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