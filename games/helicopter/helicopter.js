
var player = {x: 150, y: 250, size: 50};
var coins = [];
var gravity = 0;
var goUp = false;
var crashed = false;
var score = 0;
var gap = {height: 300, y: 250};
var walls = [];
var wallTimer = 0;
var smoke = [];
var smokeTimer = 20;
var shrinkpowerups = [];
var coinmaniapowerups = [];
var coinanimationTimer = 0;
//var oxygenbar = {height: 100, y: 250};
//var oxygenTimer = [];
var distance = 0;

var draw = function() {
  noStroke();
 background(0, 50, 0);
  drawWalls();
  drawPlayer();
  drawScore();
  drawDistance();

  if (crashed === false) {
    movePlayer();
    doCoin();
    doSpowerup();
    doCmpowerup();
    moveWalls();
    doSmoke();
    //doOxygen();
  } else {
    
    addCrowns(Math.floor(score/3));
    addXP(Math.floor(score/5));
    notify("info", `You gained ${Math.floor(score/3)} Crowns and ${Math.floor(score/5)} XP!`);
    youLoseScreen();
    console.log("hi");
  }
};

var drawWalls = function() {
  for(let wall of walls)  {
    fill(0,0,255);
    rect(wall.x, wall.y, wall.w, wall.h);
  }
};

var moveWalls = function() {
  for(let wall of walls) {
    wall.x -= 3;
    
    if (wall.x < player.x && wall.x + wall.w > player.x) {
      if (player.y - player.size/2 < wall.y + wall.h &&
          player.y + player.size/2 > wall.y) {
        crashed = true;
      }

    }
  }


  if (wallTimer <= 0) {
    wallTimer = 16;
    gap.y += 25 * floor(Math.round(Math.random() * 3) - 1);
    
    if (gap.y < 150) {
      gap.y = 150;
    }
    if (gap.y > 350) {
      gap.y = 350;
    }
  
  
    var newWall = {x: 500, y: 0, w: 50, h: gap.y - gap.height / 2};
    walls.push(newWall);
    newWall = {x: 500, y: gap.y + gap.height / 2, w: 50, h:1000 };
    walls.push(newWall);
  }
  wallTimer -= 1;

};

var doCoin = function() {
  
  var filteredCoins = coins.filter((coin) => {return coin.x > 0 && !coin.collected});
  coins = filteredCoins;
  
  if (Math.round(Math.random() * 100) < 1.45) {
    var newCoin = {x: 600, y: Math.round(Math.random() * 500), size: 20, collected: false};
    coins.push(newCoin);
  }
  
  for (var coin of coins) {
  
  fill(247, 251, 23);
  ellipse(coin.x, coin.y, coin.size, coin.size);
  
  coin.x -= 3;
  
  var playerRadius = player.size / 2;
  var coinRadius = coin.size / 2;
  var touchDistance = playerRadius + coinRadius;
  
  if (dist(player.x, player.y, coin.x, coin.y) < touchDistance) {
    coin.collected = true;
    if (coin.collected === true) {
      score += 1;
    //   if (oxygenbar.height <= 90) {
    //     oxygenbar.height += 10;
    //   } else {
    //     oxygenbar.height = 100;
    //   }
      fill(255,192,203);
      ellipse(player.x, player.y, ellipse.size, ellipse.size);
    }
  }
  }
};

var doSpowerup = function() {
  
  var filteredSpowerup = shrinkpowerups.filter((shrinkpowerup) => {return shrinkpowerup.x > 0 && !shrinkpowerup.collected});
  shrinkpowerups = filteredSpowerup;
  
  if (Math.round(Math.random() * 200) < 1) {
    var newShrinkpowerup = {x: 600, y: Math.round(Math.random() * 500), size: 20, collected: false};
    shrinkpowerups.push(newShrinkpowerup);
  }
  
  for (var shrinkpowerup of shrinkpowerups) {
  
  fill(100, 251, 23);
  ellipse(shrinkpowerup.x, shrinkpowerup.y, shrinkpowerup.size, shrinkpowerup.size);
  
  shrinkpowerup.x -= 3;
  
  var playerRadius = player.size / 2;
  var shrinkpowerupRadius = shrinkpowerup.size / 2;
  var touchDistance = playerRadius + shrinkpowerupRadius;
  
  if (dist(player.x, player.y, shrinkpowerup.x, shrinkpowerup.y) < touchDistance) {
    shrinkpowerup.collected = true;
    player.size = (player.size != 25) ? 25 : 50;
  }
  }
};

var doCmpowerup = function() {
  
  var filteredCoinmaniapowerups = coinmaniapowerups.filter((Cmpowerup) => {return Cmpowerup.x > 0 && !Cmpowerup.collected});
  coinmaniapowerups = filteredCoinmaniapowerups;
  
  if (Math.round(Math.random() * 500) < 1) {
    var newCmpowerup = {x: 600, y: Math.round(Math.random() * 500), size: 20, collected: false};
    coinmaniapowerups.push(newCmpowerup);
  }
  
  for (var coinmaniapowerup of coinmaniapowerups) {
  
  fill(0, 0, 0);
  ellipse(coinmaniapowerup.x, coinmaniapowerup.y, coinmaniapowerup.size, coinmaniapowerup.size);
  
  coinmaniapowerup.x -= 3;
  
  var playerRadius = player.size / 2;
  var coinmaniapowerupRadius = coinmaniapowerup.size / 2;
  var touchDistance = playerRadius + coinmaniapowerupRadius;
  
  if (dist(player.x, player.y, coinmaniapowerup.x, coinmaniapowerup.y) < touchDistance) {
    coinmaniapowerup.collected = true;
    // if (coinmaniapowerup.collected === true) {
    //   score += 10;
    //   oxygenbar.height -= 5;
    // }
  }
  }
};

var drawPlayer = function() {
  fill(0, 150, 255);
  ellipse(player.x, player.y, player.size, player.size);
};

var movePlayer = function() {
  if (goUp) {
    gravity -= 0.4;
  } else {
    gravity += 0.4;
  }
  
  if (gravity > 8) {
    gravity = 8;
  }
  if (gravity < -6) {
    gravity = -6;
  }
  
  player.y += gravity;
  
  
  if (player.y > 500 || player.y < 0) {
    crashed = true;
  }
  
  distance += 4;
  
};
  
var mousePressed = function() {
  if (mouseButton === LEFT) {
    
    goUp = true;
    
    
    
    if (crashed) {
      crashed = false;
      player.y = 255;
      player.size = 50;
      gravity = 0;
      //oxygenbar.height = 100;
      
      score = 0;
      distance = 0;
      coins = [];
      walls = [];
    }
  }
};

var mouseReleased = function() {
  if (mouseButton === LEFT) {
    goUp = false;
  }
};

var youLoseScreen = function() {
  fill(255);
  
  
  textSize(30);
  
  
  text("Game Over", 200, 200);
  
  
  text("Click to Restart", 180, 350);
  
  
};

var drawScore = function() {
  fill (255, 255, 0);
  textSize(24);
  text(score, 50, 450);
};

var drawDistance = function() {
  fill (255, 100, 0);
  textSize(24);
  text(distance, 150, 450);
};

//if (crashed == false) {
//distance += 1;
//}

var createSmoke = function(){
  var newSmoke = {x:player.x, y:player.y, size:10};
  smoke.push(newSmoke);
};

var doSmoke = function() {
  
  
  smoke = smoke.filter((s) => {return s.x > -50});
  
  
  for (var s of smoke) {
    fill(200, 200, 200, 175);
    ellipse(s.x, s.y, s.size, s.size);
    
    
    s.x -= 4;
    s.size++;
  }
};

var setup = function() {
  setInterval(createSmoke, 100);
  createCanvas(500, 500);
};

// var doOxygen = function() {
//   oxygenbar.height -= 0.1;
//   if(oxygenbar.height > 50) {
//     fill(0,255,0);
//   } else if (oxygenbar.height > 25) {
//     fill(255,255,0);
//   } else {
//     fill(255,0,0);
//   }
//   rect(425, 450 - (oxygenbar.height * 4), 50, oxygenbar.height * 4);
  
//   if (oxygenbar.height <= 1) {
//     crashed = true;
//   }
  
//   if (oxygenTimer <= 0) {
//     oxygenTimer = 700;
//     doOxygen;
//   }
// };