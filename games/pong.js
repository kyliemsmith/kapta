var xBall = 300;
var yBall = 50;
var xSpeed = (1.5, 5.5);
var ySpeed = (-5.5, -1.5);
var score = 0;

// Canvas
function setup() {
  createCanvas(400, 400);
}

//Background

function draw() {

  // Background
  background(0);

  // Paddle
  fill('#ffffff');
  rect(mouseX, 375, 90, 15);

  //Functions
  move();
  display();
  bounce();
  resetBall();
  paddle();

  //Score
  fill('#d9c3f7');
  textSize(24);
  text("Score: " + score, 10, 25);
}
// Ball Functions
function move() {
  xBall += xSpeed;
  yBall += ySpeed;
}


function bounce() {

  if (xBall < 10 ||
    xBall > 400 - 10) {
    xSpeed *= -1;
  }
  if (yBall < 10 ||
    yBall > 400 - 10) {
    ySpeed *= -1;
  }
}


// Reset Ball
function resetBall() {
 if (yBall >= 400 ||
   yBall > 400 - 10) {
     xBall = 300;
     yBall = 50;
     addCrowns(Math.floor(score/2));
     addXP(Math.floor(score/3));
     notify("info", `You gained ${Math.floor(score/2)} Crowns and ${Math.floor(score/3)} XP!`);
     score = 0;
}

}

function display() {
  fill('#d9c3f7');
  ellipse(xBall, yBall, 20, 20);
}

// Bounce off Paddle
function paddle() {
  if ((xBall > mouseX &&
      xBall < mouseX + 90) &&
    (yBall + 10 >= 375)) {
    xSpeed *= -1;
    ySpeed *= -1;
    score++;

  }
}