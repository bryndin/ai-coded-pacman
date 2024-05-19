import Level from './level.js';

const CELL_SIZE = 16;

function canMove(layout, position, size) {
    const gridX1 = Math.floor(position.x / CELL_SIZE);
    const gridX2 = Math.floor((position.x + size - 1) / CELL_SIZE);
    const gridY1 = Math.floor(position.y / CELL_SIZE);
    const gridY2 = Math.floor((position.y + size - 1) / CELL_SIZE);
    return layout[gridY1] && layout[gridY2] &&
        layout[gridY2][gridX2] !== Level.WALL &&
        layout[gridY1][gridX2] !== Level.WALL &&
        layout[gridY2][gridX1] !== Level.WALL &&
        layout[gridY1][gridX1] !== Level.WALL;
}

export default canMove;