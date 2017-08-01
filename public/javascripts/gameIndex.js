function startGame() {
  myGameArea.start();
  gamePiece = new component(50, 50, '#9b59b6', 400, 250);
  gameObstacle1 = new component(randomNum(40, 100), randomNum(50, 100), '#9E9E9E', randomNum(0, 200), randomNum(0, 250));
  gameObstacle2 = new component(randomNum(40, 190), randomNum(50, 200), '#9E9E9E', randomNum(0, 200), randomNum(0, 250));
  gameObstacle3 = new component(randomNum(40, 170), randomNum(50, 170), '#9E9E9E', randomNum(300, 490), randomNum(350, 450));
  gameObstacle4 = new component(randomNum(40, 200), randomNum(50, 210), '#9E9E9E', randomNum(600, 750), randomNum(300, 450));
  gameObstacle5 = new component(randomNum(40, 158), randomNum(50, 200), '#9E9E9E', randomNum(400, 750), randomNum(400, 450));
}

var myGameArea = {
  canvas: document.createElement('canvas'),
  keys: {},
  score: 0,
  start: function(){
    this.canvas.width = 800;
    this.canvas.height = 500;
    this.context = this.canvas.getContext('2d');
    document.body.append(this.canvas);
    this.interval = setInterval(updateGame, 20);
    this.winds = (function loop(){
      setTimeout(function(){
        updateWinds();
        loop();
      }, randomNum(300, 2000))
    }())
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

function component(width, height, color, x, y){
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
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
  gamePiece.gravity = randomNum(-1.25, 1.25)
  gamePiece.wind = randomNum(-1.25, 1.25);
}

function randomNum(min, max, wholeOrFloat){
  if (min < max) {
    if (wholeOrFloat == "whole") {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    else {
      return Math.random() * (max - min + 1) + min;
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
}

window.onload = function(){
  startGame();
}