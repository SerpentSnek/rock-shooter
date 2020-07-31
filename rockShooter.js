/* global p5 */
// our google meet link:
//https://meet.google.com/efz-mzqq-fof
const p = new p5(() => {});
const DOWN_ARROW = 40;
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;

let playerX, playerY, playerR, playerLives, score;
let rocks = []; let bullets = [];
let apple, gameStart;
//let powerups;

// maximum amount of rocks that can appear on screen
let MAX_ROCKS;

p.setup = function () {
  p.createCanvas(p.windowWidth - 20, p.windowHeight - 20);
  p.colorMode(p.HSB, 100);
  playerX = 100;
  playerY = 100;
  playerR = 15;
  MAX_ROCKS = 40;
  populateRocks();
  aim();
  score = 0;
  apple = new Apple();
  gameStart =  false;
  //powerups = new Powerups();

}
p.draw = function(){
  console.log("max. rocks: " + MAX_ROCKS + " length of rocks: " + rocks.length);
  p.background(95);
  p.noStroke();
  p.fill(60, 80, 80);
  displayText();
  if(gameStart) {

    //p.line(playerX,playerY,p.mouseX,p.mouseY)

    p.fill(60, 80, 80);
    // blue circle is the player's sprite
    p.ellipse(playerX,playerY,playerR);

    apple.show();
    apple.playerAppleCollide();
    /*
    powerups.show();
    powerups.playerPowerupsCollide();
    */

    // increasing maximum number of rocks by 20
    // if player scores more than 10 points
    if(score > 10) {
      MAX_ROCKS = 60;
    }

    // if there are not enough rocks on the screen,
    // fill the screen with some.
    if(rocks.length < 10 || apple.isCollideWithPlayer) {
      populateRocks();
    }
    /*
    if(rocks.length < 10 || powerups.isCollideWithPlayer) {
      populateRocks();
    }
    */
    for(let r of rocks) {
      r.show();
      r.move();
      r.checkCollide();
      r.checkBulletCollide();
    }

    // deleting the rock if it's hit by a bullet
    for(let r in rocks) {
      if(rocks[r].isHit) {
        rocks.splice(r,1);
      }
    }

    //deleting bullet once it hits a rock
    for(let b in bullets) {
      if(bullets[b].hasHitRock) {
        bullets.splice(b,1);
      }
    }


    for(let b of bullets) {
      // fire bullet
      // show only if no collision with rocks
      b.checkRockBulletCollide();
      b.fire();
      console.log(b.hasHitRock);
    }
    movePlayer();
  }

}

function populateRocks() {
  // populating the screen with rocks based on how many rocks
  // are still on screen
  // ^ refilling rocks
  for(let i = rocks.length; i < MAX_ROCKS; i++) {
    rocks.push(new Rock);
  }
}



function movePlayer() {

  if (p.keyIsDown(UP_ARROW) && playerY > 0 + playerR || p.keyIsDown(87)&& playerY > 0) {
    playerY -= 5;
  } else if (p.keyIsDown(DOWN_ARROW) && playerY < p.height - playerR || p.keyIsDown(83)&& playerY < p.height - playerR) {
    playerY += 5;
  } else if (p.keyIsDown(RIGHT_ARROW) && playerX < p.width - playerR|| p.keyIsDown(68)&& playerX < p.width - playerR) {
    playerX += 5;
  } else if (p.keyIsDown(LEFT_ARROW) && playerX > 0 + playerR|| p.keyIsDown(65)&& playerX > 0 + playerR) {
    playerX -= 5;
  }
  //diagonal movement
   if (p.keyIsDown(UP_ARROW) && playerY > 0 + playerR && p.keyIsDown(RIGHT_ARROW)
      ||  p.keyIsDown(87)&& p.keyIsDown(68)&& playerY > 0 + playerR) { // up and right
    playerY -= 3;
    playerX += 3;
  } else if (p.keyIsDown(UP_ARROW) && playerY < p.height-playerR && p.keyIsDown(LEFT_ARROW)
      ||  p.keyIsDown(87)&& p.keyIsDown(65)&& playerY < p.height-playerR) {// up and left
    playerY -= 3;
    playerX -= 3;
  } else if (p.keyIsDown(DOWN_ARROW) && playerX < p.width-playerR && p.keyIsDown(RIGHT_ARROW)
      ||  p.keyIsDown(83)&& p.keyIsDown(68)&& playerX < p.width-playerR ) {//down and right
    playerX += 3;
    playerY += 3;
  } else if (p.keyIsDown(DOWN_ARROW) &&p.keyIsDown(LEFT_ARROW) && playerY < p.height - playerR&& playerX > 0 + playerR
    ||  p.keyIsDown(83)&& p.keyIsDown(65) && playerY < p.height - playerR && playerX > 0 + playerR) {//down and left
    playerX -= 3;
    playerY += 3;
  }

}

function aim(){
  let moveXToGoal = p.mouseX - playerX
  let moveYToGoal = p.mouseY - playerY
  let circleX = 30
  let circleY = 30
  p.ellipse(circleX,circleY,10)
  circleX += moveXToGoal
  circleY += moveYToGoal;

}

function isPlayerWithinBounds() {
  if(playerX > 0 + playerR && playerX < p.width - playerR &&
    playerY < p.height - playerR && playerY > 0 + playerR) {
    return true;
  } else return false;
}

function showInstructions() {
  p.fill(30, 80, 60);
  p.textSize(15);
  p.text("Click the mouse to shoot bullets to destroy rocks \n and use wasd or arrow keys to move", p.width/2.5, p.height*.55);
  p.fill(5, 80, 80);
  p.text("Don't shoot too many, though, or else", p.width/2.5, p.height*.63);
  p.text("rocks will respawn in inconvenient places", p.width/2.5, p.height*.65);
  p.textSize(20);
  p.fill(0);
  p.text("Get as many apples (which appear as red squares) as you can, \nas you die with one hit", p.width/3, p.height*.7);

}

function displayText() {
  p.fill(0);
  if(gameStart == false) {
    p.textSize(30)
    p.text("Press space to begin", p.width/2.5, p.height/2);
    showInstructions();
  } else {
    p.text(`Score: ${score}`, 10, 30)
  }
}

// firing a bullet
p.mousePressed = function ()  {
  //if(p.mouseIsPressed || p.keyCode == 66)  // 66 is the keycode for 'b'
    bullets.push(new Bullet(playerX, playerY));

}

//starting game
p.keyPressed = function() {
  if(p.keyCode == 32) { // press spacebar to start game
    gameStart = true;
  }
}


//----------------------------------------------------classes------------------------------------------------------//
class Rock {
  constructor(/*, y, r*/) {
    // creating master velocities will allow the rocks to bounce off the walls normally
    // otherwise its absence causes the balls to spasm against the wall
    this.mXvel = p.random(0.5, 5);
    this.mYvel = p.random(0.5, 5);
    this.xVel = p.random(1, 10);
    this.yVel = p.random(1, 10);

    // have rocks spawn away from player so that the player doesn't
    // get one-shotted by having a rock spawn on top of them
    this.x = p.random(playerX + 50, p.width);
    this.y = p.random(playerY + 50, p.height);
    this.r = p.random(40, 130);
    this.isHit = false;

  }

  show() {
    if(this.isHit == false) {
      p.noStroke();
      p.fill(0, 50, 50);
      if(this.r >= 70) {
        p.fill(40, 50, 50);
      }
      p.ellipse(this.x, this.y, this.r, this.r);
    }

  }
  move() {
    this.x += this.xVel;
    this.y += this.yVel;

    if (this.x + this.r > p.width) {
      this.xVel = -1 * this.mXvel;
    }
    if (this.x - this.r < 0) {
      this.xVel = this.mXvel;
    }
    if (this.y + this.r > p.height) {
      this.yVel = -1 * this.mYvel;
    }
    if (this.y - this.r < 0) {
      this.yVel = this.mYvel;
    }

  }

  // check to see if any rock hits the player
  checkCollide() {
    //console.log( "player-rock collide? "+ p.collideCircleCircle(playerX, playerY, 10, this.x, this.y, this.r));
    if(p.collideCircleCircle(playerX, playerY, playerR, this.x, this.y, this.r)) {
      // display game over text
      p.fill(0);
      p.textSize(100);
      p.text("game over", p.width/3, p.height/2)
      p.noLoop();

    }
  }

  // check to see if rock has been hit by bullet
  checkBulletCollide() {
    for(let b of bullets) {
      if(p.collideCircleCircle( this.x, this.y, this.r, b.getX(), b.getY(), b.getR() )) {
          this.isHit = true;

      }
    }
  }

  splitInto4() {
    // create 4 more new rocks,
    // each with their own velocities
    for(let n = 0; n < 4; n++) {
      rocks.push(new Rock(this.getX(), this.getY(), 20)); // it splits into 4 but not from the rock's point of origin

    }
  }

  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getR() {
    return this.r;
  }


}

//-----------------------------------bullet class-------------------------------------------------//

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xVel = p.mouseX - this.x;
    this.yVel = p.mouseY - this.y;
    this.r = 10;
    this.hasHitRock = false;
  }

  fire() {
    if(this.hasHitRock == false) {
      p.noStroke();
      p.fill(10, 80, 80);
      p.ellipse(this.x, this.y, this.r, this.r);

      /*
      //this.y -=15
      let moveXToGoal = (p.mouseX - playerX)/10
      let moveYToGoal = (p.mouseY - playerY)/10
      this.x += moveXToGoal
      this.y += moveYToGoal
      */
      this.x += this.xVel/50;
      this.y += this.yVel/50;
      if(this.x<=0|| this.x >= p.windowWidth - 20 || this.y <= 0 || this.y >= p.windowHeight - 20)
        {
           bullets.splice(bullets,1)
        }

    }
  }


  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getR() {
    return this.r;
  }

  // check if bullet has hit the rock
  checkRockBulletCollide() {
    for(let r of rocks) {
      if(p.collideCircleCircle( this.x, this.y, this.r, r.getX(), r.getY(), r.getR() )) {
        this.hasHitRock = true;
      }
    }

  }


  // bullet will travel to where the mouse is
  bulletDirection(){
    let moveXToGoal = p.mouseX - playerX
    let moveYToGoal = p.mouseY - playerY

    this.y += moveYToGoal
    this.X += moveXToGoal
    p.noLoop();


  }

}
//-----------------------------Apple class------------------------------------//
class Apple {
  constructor() {
    this.x = p.random(p.width - 40);
    this.y = p.random(p.height - 40);
    this.r = 10;
    this.isCollideWithPlayer = false;
  }
  show() {
    p.noStroke();
    p.fill(0, 70, 70);
    p.rect(this.x, this.y, this.r, this.r)
  }

  playerAppleCollide() {
    if(p.collideCircleCircle(this.x, this.y, this.r, playerX, playerY, playerR)) {
      this.isCollideWithPlayer = true;
      this.x = p.random(100, p.width - 40);
      this.y = p.random(100, p.height - 40);
      score += 1;
      rocks = [];
      populateRocks();
      apple = new Apple();
    }
  }
}
//-----------------------------powerups class------------------------------------//
class Powerups {
  constructor() {
    this.x = p.random(p.width - 50);
    this.y = p.random(p.height - 50);
    this.r = 10;
    this.isCollideWithPlayer = false;
  }
  show() {
    p.noStroke();
    p.fill(70, 70, 70);
    p.ellipse(this.x, this.y, this.r, this.r)
  }

  playerPowerupsCollide() {
    if(p.collideCircleCircle(this.x, this.y, this.r, playerX, playerY, playerR)) {
      this.isCollideWithPlayer = true;
      this.x = p.random(100, p.width - 40);
      this.y = p.random(100, p.height - 40);

      powerups = new Powerups();

    }
  }
}
