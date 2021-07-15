var gridSize = 20;
var snake;
var newDir;
var timer;
var tickSpeed;
var apple;
var score;
var crashed;
var paused;
var pauseText = "PRESS P TO PAUSE";
var givenRewards = false;

var setup = function() {
    createCanvas(500, 500);
    background(0);
    newDir = "right";
    timer = millis();
    tickSpeed = 125;
    score = 0;
    givenRewards = false;
    textSize(32);
    textAlign(CENTER, TOP);
    crashed = false;
    paused = false;
    text(pauseText, 250, 250);
    apple = {
        x: floor(random(0, width / gridSize)) * gridSize + 10,
        y: floor(random(5, height / gridSize)) * gridSize + 10
    };
    snake = {
        dir: "right",
        x: 110,
        y: 50,
        tail: [{
            x: 50,
            y: 50
        }, {
            x: 70,
            y: 50
        }, {
            x: 90,
            y: 50
        }]
    };
};

var crashCheck = function() {
    for (var i = 0; i < snake.tail.length; i++) {
        if (snake.tail[i].x == snake.x && snake.tail[i].y == snake.y) {
            crashed = true;
            fill(255, 255, 0);
            ellipse(snake.x, snake.y, gridSize, gridSize);
            stroke(255, 0, 0);
            strokeWeight(4);
            line(snake.x - 10, snake.y - 10, snake.x + 10, snake.y + 10);
            line(snake.x - 10, snake.y + 10, snake.x + 10, snake.y - 10);
            if (givenRewards == false) {
                givenRewards = true;
                addCrowns(Math.floor(score/2));
                addXP(Math.floor(score/3));
                notify("info", `You gained ${Math.floor(score/2)} Crowns and ${Math.floor(score/3)} XP!`);
            }
        }
    }
};
var draw = function() {
    if (paused) {
        return;
    }
    if (millis() - timer >= tickSpeed) {
        background(0);
        snake.dir = newDir;
        if (!crashed) {
            moveSnake();
        } else {
            text("PRESS SPACE TO RESTART", 250, 250);
        }
        drawSnake();
        crashCheck();
        timer = millis();
        wrap();
        drawApple();
        drawScore();
        eatApple();
    }
};
var eatApple = function() {
    if (snake.x === apple.x && snake.y === apple.y) {
        snake.tail.push({
            x: snake.x,
            y: snake.y
        });
        moveApple();
        score = score + 1;
    }
};
var moveApple = function() {
    apple.x = floor(random(0, width / gridSize)) * gridSize + 10;
    apple.y = floor(random(0, height / gridSize)) * gridSize + 10;
    for (var i = 0; i < snake.tail.length; i++) {
        if (apple.x === snake.tail[i].x && apple.y === snake.tail[i].y) {
            moveApple();
        }
    }
};
var drawScore = function() {
    fill(255);
    stroke(10);
    strokeWeight(0);
    text(score, 250, 10);
};
var drawApple = function() {
    fill(255, 0, 0);
    ellipse(apple.x, apple.y, gridSize, gridSize);
};
var wrap = function() {
    if (snake.x > width) {
        //crashed = true;
        snake.x = snake.x - width;
    } else if (snake.x < 0) {
        snake.x = snake.x + width;
        //crashed = true;
    } else if (snake.y > height) {
        snake.y = snake.y - width;
        //crashed = true;
    } else if (snake.y < 0) {
        snake.y = snake.y + height;
        //crashed = true;
    }
};

var drawSnake = function() {
    fill(255, 255, 0);
    ellipse(snake.x, snake.y, gridSize, gridSize);
    for (var i = 0; i < snake.tail.length; i++) {
        fill(0, 255, 0);
        stroke(0, 0, 0);
        strokeWeight(1);
        ellipse(snake.tail[i].x, snake.tail[i].y, gridSize, gridSize);
    }
};

var moveSnake = function() {
    snake.tail.push({
        x: snake.x,
        y: snake.y
    });
    if (snake.dir === "right") {
        snake.x += gridSize;
    } else if (snake.dir === "left") {
        snake.x -= gridSize;
    } else if (snake.dir === "up") {
        snake.y -= gridSize;
    } else if (snake.dir === "down") {
        snake.y += gridSize;
    }
    wrap();
    snake.tail.splice(0, 1);
};
var keyPressed = function() {
    if (keyCode === 39 && snake.dir !== "left") {
        newDir = "right";
    }
    if (keyCode === 37 && snake.dir !== "right") {
        newDir = "left";
    }
    if (keyCode === 38 && snake.dir !== "down") {
        newDir = "up";
    }
    if (keyCode === 40 && snake.dir !== "up") {
        newDir = "down";
    }
    if (keyCode === 32) {
        if (crashed === true) {
            setup();
        }
    }
    if (keyCode === 80 && !crashed) {
        if (paused) {
            paused = false;
        } else {
            paused = true;
            fill(30, 30, 30);
            rect(width / 2 - 100, height / 2 - 50, 200, 100);
            fill(0, 255, 0);
            text("PAUSED", width / 2, height / 2 - 16);
        }
    }
};