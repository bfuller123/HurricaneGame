var obstacles = [];
var boosts = [];

function startGame() {
  obstacles = [];
  document.getElementById("button").disabled = true;
  myGameArea.score = 0;
  myGameArea.start();
  gamePiece = new component(50, 50, '#9b59b6', 400, 250, false);
  gameObstacle1 = new component(randomNum(40, 100), randomNum(50, 100), '#9E9E9E', randomNum(0, 200), randomNum(0, 250), false);
  gameObstacle2 = new component(randomNum(40, 190), randomNum(50, 200), '#9E9E9E', randomNum(0, 200), randomNum(0, 250), false);
  gameObstacle3 = new component(randomNum(40, 170), randomNum(50, 170), '#9E9E9E', randomNum(300, 490), randomNum(350, 450), false);
  gameObstacle4 = new component(randomNum(40, 200), randomNum(50, 210), '#9E9E9E', randomNum(600, 750), randomNum(300, 450), false);
  gameObstacle5 = new component(randomNum(40, 158), randomNum(50, 200), '#9E9E9E', randomNum(400, 750), randomNum(400, 450), false);
}

function loadGame() {
  myGameArea.load();
  gamePiece = new component(50, 50, '#9b59b6', 400, 250);
  gamePiece.update();
}

var myGameArea = {
  addObstacle: function(){
    movingObstacle = new component(35, 35, '#1abc9c', 751, randomNum(0, 450), true);
    obstacles.push(movingObstacle);
  },
  canvas: document.createElement('canvas'),
  keys: {},
  load: function(){
    this.canvas.width = 800;
    this.canvas.height = 500;
    this.context = this.canvas.getContext('2d');
    document.body.append(this.canvas);
  },
  score: 0,
  start: function(){
    this.interval = setInterval(updateGame, 20);
    this.addObs = (function loop(){
      setTimeout(function(){
        myGameArea.addObstacle();
        loop();
      }, randomNum(300, 3000));
    }());
    this.winds = (function loop(){
      setTimeout(function(){
        updateWinds();
        loop();
      }, randomNum(300, 2000))
    }());
    this.boost = (function loop(){
      setTimeout(function(){
        addBoost();
        loop();
      }, randomNum(10000, 35000))
    }());
    window.addEventListener('keydown', function(e) {
      myGameArea.keys[e.keyCode] = true;
    }),
    window.addEventListener('keyup', function(e){
      myGameArea.keys[e.keyCode] = false;
    })
  },
  clear: function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function addBoost() {
  var boost = new component(20, 20, '#19B5FE', randomNum(0, 750), randomNum(0, 450), false);
  boosts.pop();
  boosts.push(boost);
}

function component(width, height, color, x, y, breakable){
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.breakable = breakable;
  this.speedX = 0;
  this.speedy = 0;
  this.gravity = 0;
  this.wind = 0;
  this.update = function(){
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
  this.newPOS = function(){
    this.x = this.x + this.speedX + this.wind;
    this.y = this.y + this.speedY + this.gravity;
  },
  this.crashWith = function(otherObj){
    var myLeft = this.x;
    var myRight = this.x + this.width;
    var myTop = this.y;
    var myBottom = this.y + this.height;
    var otherObjLeft = otherObj.x;
    var otherObjRight = otherObj.x + otherObj.width;
    var otherObjTop = otherObj.y;
    var otherObjBottom = otherObj.y + otherObj.height;
    var crash = true;
    if (myBottom < otherObjTop || myTop > otherObjBottom || myLeft > otherObjRight || myRight < otherObjLeft) {
      crash = false;
    }
    return crash;
  }
}

function updateWinds() {
  gamePiece.gravity = 0;
  gamePiece.wind = 0;
  gamePiece.gravity = randomNum(-1, 1);
  gamePiece.wind = randomNum(-1, 1);
  if (obstacles.length > 0) {
    for (var i = 0; i < obstacles.length; i++) {
      obstacles[i].gravity = gamePiece.gravity;
      obstacles[i].wind = gamePiece.wind;
    }
  }
}

function randomNum(min, max, wholeOrFloat){
  if (min < max) {
    if (wholeOrFloat == "whole") {
      return Math.floor(Math.random() * (max - min) + min);
    }
    else {
      return Math.random() * (max - min) + min;
    }
  }
}

function updateGame(){
  myGameArea.clear();
  gamePiece.speedY = 0;
  gamePiece.speedX = 0;
  myGameArea.score += 2;
  document.getElementById('score').textContent = myGameArea.score;
  if (gamePiece.x <= 0 || gamePiece.x >= 750 || gamePiece.y <= 0 || gamePiece.y >= 450 || gamePiece.crashWith(gameObstacle1) || gamePiece.crashWith(gameObstacle2) || gamePiece.crashWith(gameObstacle3) || gamePiece.crashWith(gameObstacle4) || gamePiece.crashWith(gameObstacle5)) {
    clearInterval(myGameArea.interval);
    clearInterval(myGameArea.winds);
    document.getElementById("button").disabled = false;
  }
  if (myGameArea.keys && myGameArea.keys[37]) {gamePiece.speedX = -1; }
  if (myGameArea.keys && myGameArea.keys[39]) {gamePiece.speedX = 1; }
  if (myGameArea.keys && myGameArea.keys[38]) {gamePiece.speedY = -1; }
  if (myGameArea.keys && myGameArea.keys[40]) {gamePiece.speedY = 1; }
  gamePiece.newPOS();
  gamePiece.update();
  gameObstacle5.update();
  gameObstacle4.update();
  gameObstacle3.update();
  gameObstacle2.update();
  gameObstacle1.update();
  if (obstacles.length > 0) {
    for(let i = 0; i < obstacles.length; i++) {
      if (obstacles[i].crashWith(gameObstacle1) || obstacles[i].crashWith(gameObstacle2) || obstacles[i].crashWith(gameObstacle3) || obstacles[i].crashWith(gameObstacle4) || obstacles[i].crashWith(gameObstacle5)) {
        obstacles.splice(i, 1);
      }
      else if (obstacles[i].crashWith(gamePiece)) {
        clearInterval(myGameArea.interval);
        clearInterval(myGameArea.winds);
        document.getElementById("button").disabled = false;
      }
      else {
        obstacles[i].x -= 2;
        obstacles[i].x = obstacles[i].x + obstacles[i].wind;
        obstacles[i].y = obstacles[i].y + obstacles[i].gravity;
        obstacles[i].update();
      }
    }
  }
  if (boosts.length > 0) {
    for(let i = 0; i < boosts.length; i++){
      boosts[i].update();
      if (boosts[i].crashWith(gamePiece)) {
        myGameArea.score += 1000;
        boosts.splice(i, 1);
      }
    }
  }
}

window.onload = function(){
  loadGame();
}
