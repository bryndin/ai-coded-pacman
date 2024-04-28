let pacmanX, pacmanY;
let pacmanRadius = 20;
let angleStart = 0.2;
let angleEnd = TWO_PI - 0.2;
let mouthOpen = true;

function setup() {
    createCanvas(400, 400);
    pacmanX = width / 2;
    pacmanY = height / 2;
}

function draw() {
    background(0);

    // Draw Pacman
    fill(255, 255, 0);
    arc(pacmanX, pacmanY, pacmanRadius * 2, pacmanRadius * 2, angleStart, angleEnd, PIE);

    // Animate mouth
    if (mouthOpen) {
        angleStart += 0.05;
        angleEnd -= 0.05;
        if (angleStart >= TWO_PI / 3 || angleEnd <= TWO_PI - TWO_PI / 3) {
            mouthOpen = false;
        }
    } else {
        angleStart -= 0.05;
        angleEnd += 0.05;
        if (angleStart <= 0.2 || angleEnd >= TWO_PI - 0.2) {
            mouthOpen = true;
        }
    }
}