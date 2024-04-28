/**
* Made with p5play!
* https://p5play.org
*/

// Learn more about p5play here -> https://p5play.org/learn

let box;

function setup() {
// creates a canvas that fills the screen
    new Canvas();
}

function draw() {
    clear(); // try removing this line and see what happens!

    textSize(24);
    textAlign(CENTER);
fill(200);
    text('Tap to create a new sprite, drag to throw it!', canvas.w / 2, canvas.h / 2);

    if (mouse.presses()) {
//              (      x, y,    width, height)
box = new Sprite(mouse.x, mouse.y, 30, 30);
// by default, sprites collide with other sprites
}
if (mouse.dragging()) {
box.moveTowards(mouse); // throw the box!
}
// if the user didn't throw the box,
// then give it a random speed and direction
if (mouse.released() && !mouse.dragged()) {
box.speed = random(0, 5);
box.direction = random(0, 360);
}

    // by default, all sprites are drawn by p5play
    // after the end of the draw function
}