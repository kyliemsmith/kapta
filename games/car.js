var laneWidth;
var crashed = false;
var carWidth = 80;
var playerLane;
var carHeight = 100;
var score = 20;
var maxCars = 4;
var maxExtraCeilingThreshold = 50;
var carSpeed = 1;
var cars = [];
var rewardsGiven = false;
var colors = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"];

function setup() {
  createCanvas(500, 500);
  playerLane = Math.round(random(1, 3));
}

function draw() {
  background(220);
  if (crashed == false) {
    drawLanes();
    drawCars();
    repopulateCars();
    fixCars();
    moveCars();
    fill(color("gray"));
    rect(0, 0, width + 1, 80);
    drawScore();
    drawPlayer();
    detectCollisionsInPlayerLane();
  } else {
    textSize(50);
    fill(color("red"));
    text("GAME OVER", 100, 250);
    if (rewardsGiven = false) {
        addCrowns(Math.floor(score/2));
        addXP(Math.floor(score/3));
        notify("info", `You gained ${Math.floor(score/2)} Crowns and ${Math.floor(score/3)} XP!`);
        rewardsGiven = true;
    }
  }
}

function drawLanes() {
  laneWidth = width / 3;
  
  for (var lanes = 1; lanes <= 3; lanes++) {
    currentLaneX = lanes * laneWidth;
    
    line(currentLaneX, 0, currentLaneX, height);
  }
}

function drawCars() {
  for (var car of cars) {
    fill(color(car.color));
    rect((car.lane * laneWidth) - ((laneWidth / 2) + carWidth / 2), car.y, carWidth, carHeight);
  }
}

function repopulateCars() {
  if (cars.length < maxCars) {
    cars.push({lane: Math.round(random(1, 3)), y: (((carWidth * -1) - 1) - Math.round(random(0, maxExtraCeilingThreshold + 1000))), color: color(colors[Math.round(random(0, (colors.length - 1)))])});
  }
  for (var car of cars) {
    if (car.y > height) {
      score++;
      cars.splice(cars.indexOf(car), 1);
      cars.push({lane: Math.round(random(1, 3)), y: (((carWidth * -1) - 1) - Math.round(random(0, maxExtraCeilingThreshold))), color: color(colors[Math.round(random(0, (colors.length - 1)))])});
    }
  }
}

function moveCars() {
  for (var car of cars) {
    car.y += carSpeed;
  }
}

function drawScore() {
  fill(color("black"));
  textSize(50);
  text(score, 0, 40);
}

function fixCars() {
  for (var lanes = 3; lanes > 0; lanes--) {
    var filteredCars = [];
    for (var car of cars) {
      if (car.lane == lanes) {
        filteredCars.push(car);
      }
    }
    for (var carFiltered of filteredCars) {
      for (var otherCarFiltered of filteredCars) {
        if (carFiltered.y > otherCarFiltered.y && (carFiltered.y - (carWidth + 1)) <= 0 && carFiltered.y < height) {
          cars.splice(cars.indexOf(otherCarFiltered), 1);
          cars.push({lane: Math.round(random(1, 3)), y: (((carWidth * -1) - 1) - Math.round(random(0, maxExtraCeilingThreshold))), color: color(colors[Math.round(random(0, (colors.length - 1)))])});
        }
      }
    }
  }
for (var carOne of cars) {
      for (var carTwo of cars) {
        if (carOne.y > carTwo.y && (carOne.y - (carWidth + 1)) <= 0 && carOne.y < height) {
          cars.splice(cars.indexOf(carTwo), 1);
          cars.push({lane: Math.round(random(1, 3)), y: (((carWidth * -1) - 1) - Math.round(random(0, maxExtraCeilingThreshold))), color: color(colors[Math.round(random(0, (colors.length - 1)))])});
        }
      }
    }
}

function drawPlayer() {
  fill(color("red"));
  rect((playerLane * laneWidth) - ((laneWidth / 2) + carWidth / 2), height - carHeight, carWidth, carHeight);
}

function detectCollisionsInPlayerLane() {
  var filteredCars = [];
  for (var car of cars) {
    if (car.lane == playerLane) {
      filteredCars.push(car);
    }
  }
  for (var carFiltered of filteredCars) {
    if ((carFiltered.y + carHeight) > (height - carHeight) && carFiltered.y < height) {
      crashed = true;
    }
  }
}

function reset() {
  score = 0;
  cars = [];
  playerLane = Math.round(random(1, 3));
  crashed = false;
  rewardsGiven = false;
}

function keyPressed() {
  //console.log(`Keycode: ${keyCode}`);
  if (keyCode == 65 || keyCode == 37) {
    //Left
    if (playerLane - 1 > 0) {
      console.log(`playerLane: ${playerLane}`)
      playerLane--;
    }
  } else if (keyCode == 68 || keyCode == 39) {
    //Right
    if (playerLane < 3) {
      playerLane++;
    }
  } else if (keyCode == 32) {
    reset();
  } else if (keyCode == 38 || keyCode == 87) {
      carSpeed = 2;
    }
}

function keyReleased() {
  if (keyCode == 38 || keyCode == 87) {
    carSpeed = 1;
  }
}

function mouseClicked() {
  if (crashed == true) {
    reset();
  }
}