import Game from "./game.js";
import Pacman from "./pacman.js";
import { Renderer } from "./renderer.js";

// Add setup and draw to the global scope
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;

let game, renderer;

export function setup() {
    game = new Game();
    renderer = new Renderer(28, 36);
}

export function draw() {
    game.main();

    if (game.state == Game.states.GAME_OVER) {
        return;
    }

    renderer.draw(game);
}

export function keyPressed() {
    if (game.state === Game.states.WAITING) {
        game.setState(Game.states.RUNNING);
    }

    switch (keyCode) {
        case UP_ARROW:
        case 87: // W key
            game.pacman.setDesiredDirection(Pacman.UP);
            break;
        case DOWN_ARROW:
        case 83: // S key
            game.pacman.setDesiredDirection(Pacman.DOWN);
            break;
        case LEFT_ARROW:
        case 65: // A key
            game.pacman.setDesiredDirection(Pacman.LEFT);
            break;
        case RIGHT_ARROW:
        case 68: // D key
            game.pacman.setDesiredDirection(Pacman.RIGHT);
            break;

        // Developers visualization
        case 219: // [ key
            renderer.showScatterCells = !renderer.showScatterCells;
            break;
        case 221: // ] key
            renderer.showGhostTargets = !renderer.showGhostTargets;
            break;
    }
}
