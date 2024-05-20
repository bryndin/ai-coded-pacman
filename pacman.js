import Level from "./level.js";
import { CELL_SIZE } from "./renderer.js";

class Pacman {
  static NONE = { x: 0, y: 0 };
  static RIGHT = { x: 1, y: 0 };
  static LEFT = { x: -1, y: 0 };
  static UP = { x: 0, y: -1 };
  static DOWN = { x: 0, y: 1 };

  constructor(startPosition, size, speed) {
    this.position = { x: startPosition.x * CELL_SIZE + CELL_SIZE / 2, y: startPosition.y * CELL_SIZE + CELL_SIZE / 2 };
    this.size = size;
    this.speed = speed;
    this.direction = Pacman.NONE;
    this.desiredDirection = Pacman.NONE;
  }

  move(layout) {
    const newPosition = {
      x: this.position.x + this.speed * this.desiredDirection.x,
      y: this.position.y + this.speed * this.desiredDirection.y,
    };

    if (this.canMove(layout, newPosition)) {
      this.position = newPosition;
      this.direction = this.desiredDirection;
    } else {
      const currentPosition = {
        x: this.position.x + this.speed * this.direction.x,
        y: this.position.y + this.speed * this.direction.y,
      };

      if (this.canMove(layout, currentPosition)) {
        this.position = currentPosition;
      }
    }
  }

  setDesiredDirection(direction) {
    this.desiredDirection = direction;
  }

  canMove(layout, position) {
    const gridX1 = Math.floor((position.x - this.size / 2) / CELL_SIZE);
    const gridX2 = Math.floor((position.x + this.size / 2 - 1) / CELL_SIZE);
    const gridY1 = Math.floor((position.y - this.size / 2) / CELL_SIZE);
    const gridY2 = Math.floor((position.y + this.size / 2 - 1) / CELL_SIZE);
    return layout[gridY1] && layout[gridY2] &&
      layout[gridY2][gridX2] !== Level.WALL &&
      layout[gridY1][gridX2] !== Level.WALL &&
      layout[gridY2][gridX1] !== Level.WALL &&
      layout[gridY1][gridX1] !== Level.WALL;
  }
}

export default Pacman;