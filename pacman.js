import { Collidable } from "./collidable.js";
import Level from "./level.js";
import { CELL_SIZE } from "./constants.js";
import DIRECTIONS from "./directions.js";

class Pacman extends Collidable {
  static size = CELL_SIZE;

  constructor(startCell, speed) {
    super(startCell, Pacman.size);
    this.speed = speed;
    this.direction = DIRECTIONS.NONE;
    this.desiredDirection = DIRECTIONS.NONE;
  }

  move(layout) {
    this.attemptMove(this.desiredDirection, layout);
    if (this.direction !== this.desiredDirection) {
      this.attemptMove(this.direction, layout);
    }
  }

  attemptMove(direction, layout) {
    const newPosition = {
      x: this.position.x + this.speed * direction.x,
      y: this.position.y + this.speed * direction.y,
    };

    if (this.canMove(layout, newPosition)) {
      this.position = newPosition;
      this.direction = direction;
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

    // Check all four corners for wall collisions
    if (layout[gridY1]?.[gridX1] === Level.WALL ||
      layout[gridY2]?.[gridX1] === Level.WALL ||
      layout[gridY1]?.[gridX2] === Level.WALL ||
      layout[gridY2]?.[gridX2] === Level.WALL) {
      return false;
    }
    return true;
  }
}

export default Pacman;