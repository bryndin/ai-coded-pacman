import canMove from "./shared.js";

const CELL_SIZE = 16;

class Pacman {
  static RIGHT = { x: 1, y: 0 };
  static LEFT = { x: -1, y: 0 };
  static UP = { x: 0, y: -1 };
  static DOWN = { x: 0, y: 1 };

  constructor(startPosition, size, speed) {
    this.position = { x: startPosition.x * CELL_SIZE, y: startPosition.y * CELL_SIZE };
    this.size = size;
    this.speed = speed;
    this.direction = { x: 0, y: 0 }
    this.desiredDirection = { x: 0, y: 0 };
  }

  move(layout) {
    const newPosition = {
      x: this.position.x + this.speed * this.desiredDirection.x,
      y: this.position.y + this.speed * this.desiredDirection.y,
    };

    if (canMove(layout, newPosition, this.size)) {
      this.position = newPosition;
      this.direction = this.desiredDirection;
    } else {
      const currentPosition = {
        x: this.position.x + this.speed * this.direction.x,
        y: this.position.y + this.speed * this.direction.y,
      };

      if (canMove(layout, currentPosition, this.size)) {
        this.position = currentPosition;
      }
    }
  }

  setDesiredDirection(direction) {
    this.desiredDirection = direction;
  }
}

export default Pacman;