var game = new Phaser.Game(900, 600, Phaser.AUTO, 'gameDiv');

var gameSpeed = 300;
var powerupTaken = false;
var shotsLeft = 0;

var mainState = {

    preload: function() {

      // preload state
      var headingStyle = { font: "30px Arial", fill: "#ffffff" };
      var footerStyle = { font: "14px Arial", fill: "#ffffff" };

      var x = game.world.width/2;
      var y = game.world.height/2;
          
      var headingText = this.game.add.text(x, y-50, "Loading... Please wait...", headingStyle);
      headingText.anchor.setTo(0.5, 0.5);

      var footerText = this.game.add.text(x, y + 70, "Built with <3 in Banjarapalya", footerStyle);
      footerText.anchor.setTo(0.5, 0.5);


      // game graphics

      this.game.load.image('bg', 'assets/bg.png');
      this.game.load.image('paddle', 'assets/paddle.png');
      this.game.load.image('ballBlue', 'assets/ballBlue.png');
      this.game.load.image('ballGrey', 'assets/ballGrey.png');
      this.game.load.image('hbar', 'assets/hbar.png');
      this.game.load.image('hbarBottom', 'assets/hbarBottom.png');
      this.game.load.image('vbar', 'assets/vbar.png');
      this.game.load.image('blueBlock', 'assets/blueBlock.png');
      this.game.load.image('greenBlock', 'assets/greenBlock.png');
      this.game.load.image('greyBlock', 'assets/greyBlock.png');
      this.game.load.image('purpleBlock', 'assets/purpleBlock.png');
      this.game.load.image('redBlock', 'assets/redBlock.png');
      this.game.load.image('yellowBlock', 'assets/yellowBlock.png');
      this.game.load.image('particleStar', 'assets/particleStar.png');
      this.game.load.image('particleSmallStar', 'assets/particleSmallStar.png');
      this.game.load.image('particleCartoonStar', 'assets/particleCartoonStar.png');
      this.game.load.image('laserGreen', 'assets/laserGreen.png');
      this.game.load.image('laserGreenPowerup', 'assets/laserGreenPowerup.png');


      // game sounds

      this.game.load.audio('bgMusic', 'assets/bg.ogg');
      this.game.load.audio('paddleHit', 'assets/paddleHit.ogg');
      this.game.load.audio('brickHit', 'assets/brickHit.ogg');
      this.game.load.audio('newBall', 'assets/newBall.ogg');
      this.game.load.audio('ballCrash', 'assets/ballCrash.ogg');
      this.game.load.audio('powerupArrived', 'assets/powerupArrived.ogg');
      this.game.load.audio('laserShot', 'assets/laserShot.ogg');
    },

    create: function() { 

      this.game.stage.backgroundColor = 0x337799;
      this.game.add.tileSprite(0, 0, 900, 600, 'bg');
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      // horizontal boundaries
      this.hbarTop = this.game.add.sprite(0, 0, 'hbar');
      this.game.physics.arcade.enable(this.hbarTop);
      this.hbarTop.body.immovable = true;

      this.hbarBottom = this.game.add.sprite(0, 590, 'hbarBottom');
      this.game.physics.arcade.enable(this.hbarBottom);
      this.hbarBottom.body.immovable = true;

      // vertical boundaries

      // left bar
      this.vbarLeft = this.game.add.sprite(0, 0, 'vbar');
      this.game.physics.arcade.enable(this.vbarLeft);
      this.vbarLeft.body.immovable = true;

      // right bar
      this.vbarRight = this.game.add.sprite(890, 0, 'vbar');
      this.game.physics.arcade.enable(this.vbarRight);
      this.vbarRight.body.immovable = true;      

      // paddle
      this.paddle = this.game.add.sprite(900 / 2 - 80, 550, 'paddle');
      this.game.physics.arcade.enable(this.paddle);
      this.paddle.body.collideWorldBounds = true;
      this.paddle.body.immovable = true;
      this.paddle.anchor.setTo(0.5, 0.5);

      // bricks
      this.bricks = game.add.group();
      this.bricks.enableBody = true;
      var brickVelocity = 15;
      var newBrick;
      for (var i = 1; i <= 12; i++) {
        newBrick = this.bricks.create( i * 63, 10, 'greenBlock');
        newBrick.body.velocity.y = brickVelocity;
      }
      for (i = 1; i <= 12; i++) {
        newBrick = this.bricks.create( i * 63, 45, 'purpleBlock');
        newBrick.body.velocity.y = brickVelocity;
      }
      for (i = 1; i <= 12; i++) {
        newBrick = this.bricks.create( i * 63, 80, 'redBlock');
        newBrick.body.velocity.y = brickVelocity;
      }
      for (i = 1; i <= 12; i++) {
        newBrick = this.bricks.create( i * 63, 115, 'yellowBlock');
        newBrick.body.velocity.y = brickVelocity;
      }
      for (i = 1; i <= 12; i++) {
        newBrick = this.bricks.create( i * 63, 150, 'blueBlock');
        newBrick.body.velocity.y = brickVelocity;
      }
      for (i = 1; i <= 12; i++) {
        newBrick = this.bricks.create( i * 63, 185, 'greyBlock');
        newBrick.body.velocity.y = brickVelocity;
      }

      // background music
      this.bgMusic = game.add.audio('bgMusic', 0.1, true);
      this.bgMusic.play();

      // paddle hit music
      this.paddleHit = game.add.audio('paddleHit');

      // brick hit music
      this.brickHit = game.add.audio('brickHit');

      // new ball music
      this.newBall = game.add.audio('newBall');

      // ball crash music
      this.ballCrash = game.add.audio('ballCrash');

      // powerup arrived
      this.powerupArrived = game.add.audio('powerupArrived');

      // laser shot
      this.laserShot = game.add.audio('laserShot');

      // balls
      this.balls = game.add.group();
      this.balls.enableBody = true;
      this.game.physics.arcade.enable(this.balls);
      this.createNewBall();

      // laser
      this.lasers = game.add.group();
      this.lasers.enableBody = true;
      this.game.physics.arcade.enable(this.lasers);

      // particles
      this.starEmitter = game.add.emitter(0, 0, 100);
      this.starEmitter.makeParticles('particleStar');
      this.starEmitter.gravity = 200;

      this.starSmallEmitter = game.add.emitter(0, 0, 100);
      this.starSmallEmitter.makeParticles('particleSmallStar');
      this.starSmallEmitter.gravity = 200;

      this.starCartoonEmitter = game.add.emitter(0, 0, 100);
      this.starCartoonEmitter.makeParticles('particleCartoonStar');
      this.starCartoonEmitter.gravity = 200;      

      // keyboard input
      this.cursors = game.input.keyboard.createCursorKeys();

      // timer
      this.game.time.events.loop(Phaser.Timer.SECOND, this.updateSpeed, this);
      this.game.time.events.loop(7000, this.createNewBall, this);

    },

    update: function() {

      // track user movements
      if (this.cursors.left.isDown){
        this.paddle.body.velocity.x = -550;
      } else if(this.cursors.right.isDown) {
        this.paddle.body.velocity.x = 550;
      } else {
        this.paddle.body.velocity.x = 0;
      }
      if(this.cursors.up.isDown && powerupTaken && shotsLeft != 0) {
        shotsLeft -= 1;
        var laser = this.lasers.create(this.paddle.x, this.paddle.y, 'laserGreen');
        laser.body.velocity.y = -500;
        this.laserShot.play();
      }

     
      this.game.physics.arcade.collide(this.balls, this.paddle, this.ballHitPaddle, null, this);
      this.game.physics.arcade.collide(this.balls, this.hbarTop, this.ballHitTop, null, this);
      this.game.physics.arcade.collide(this.balls, this.hbarBottom, this.ballHitBottom, null, this);
      this.game.physics.arcade.collide(this.balls, this.vbarLeft, this.ballHitLeft, null, this);
      this.game.physics.arcade.collide(this.balls, this.vbarRight, this.ballHitRight, null, this);
      this.game.physics.arcade.collide(this.balls, this.bricks, this.ballHitBricks, null, this);
      this.game.physics.arcade.collide(this.hbarBottom, this.bricks, this.brickHitBottom, null, this);
      this.game.physics.arcade.collide(this.laserGreenPowerup, this.paddle, this.powerUp, null, this);
      this.game.physics.arcade.collide(this.lasers, this.bricks, this.laserHitBrick, null, this);
     
    },

    createNewBall: function(){
      var randomNum = Math.floor(Math.random() * (800 - 400 + 1)) + 400;
      var ballType;
      if(randomNum % 2 === 0) {
        ballType = 'ballGrey';
      } else {
        ballType = 'ballBlue';
      }
      var ball = this.balls.create( randomNum, 200, ballType);
      ball.body.velocity.y = gameSpeed;
      ball.anchor.set(0.5);
      ball.body.bounce.set(1);
      this.newBall.play();
    },

    ballHitPaddle: function(paddle, ball) {

      if(ball.x < paddle.x) {
        var diff = paddle.x - ball.x;
        ball.body.velocity.x = -10 * diff;
      } else if(ball.x > paddle.x) {
        var diff = ball.x - paddle.x;
        ball.body.velocity.x = 10 * diff;
      } else {
        ball.body.velocity.x = 2 + Math.random() * 8;
      }

      this.starSmallEmitter.x = ball.body.x;
      this.starSmallEmitter.y = ball.body.y;
      this.starSmallEmitter.start(true, 2000, null, 10);

      this.paddleHit.play();

    },

    ballHitTop: function(top, ball) {
      ball.body.velocity.y = gameSpeed;
    },

    ballHitLeft: function(left, ball) {
      ball.body.velocity.x = gameSpeed;
    },

    ballHitRight: function(right, ball) {
      ball.body.velocity.x = -gameSpeed;
    },

    ballHitBottom: function(bottom, ball) {

      this.starCartoonEmitter.x = ball.body.x;
      this.starCartoonEmitter.y = ball.body.y;
      this.starCartoonEmitter.start(true, 2000, null, 10);
      
      this.ballCrash.play();
      
      ball.kill();
    },

    ballHitBricks: function(ball, brick) {
      
      if(ball.body.velocity.x >= 0) {
        ball.body.velocity.x = gameSpeed;
      } else {
        ball.body.velocity.x = -gameSpeed;
      }
      if(ball.body.velocity.y >= 0) {
        ball.body.velocity.y = gameSpeed;
      } else {
        ball.body.velocity.y = -gameSpeed;
      }

      ball.body.velocity.y = -gameSpeed;

      this.starEmitter.x = ball.body.x;
      this.starEmitter.y = ball.body.y;
      this.starEmitter.start(true, 2000, null, 10);

      this.brickHit.play();
      brick.kill();
      gameSpeed += 2;

      if (this.bricks.countLiving() <= 50 && !powerupTaken) {
        powerupTaken = true;
        // powerup
        this.laserGreenPowerup = this.game.add.sprite(Math.floor(Math.random() * (800 - 400 + 1)) + 400, 0, 'laserGreenPowerup');
        this.game.physics.arcade.enable(this.laserGreenPowerup);
        this.laserGreenPowerup.body.velocity.y = 300;
        this.powerupArrived.play();
      }

      if (this.bricks.countLiving() === 0) {
        console.log('You Won');
      }

    },

    laserHitBrick: function(laser, brick) {

      this.starEmitter.x = brick.body.x;
      this.starEmitter.y = brick.body.y;
      this.starEmitter.start(true, 4000, null, 30);
      laser.kill();
      brick.kill();

      if (this.bricks.countLiving() === 0) {
        game.state.start('won');
      }

    },

    brickHitBottom: function(bottom, brick) {
      game.state.start('failed');
    },

    powerUp: function() {
      this.starSmallEmitter.x = this.laserGreenPowerup.body.x;
      this.starSmallEmitter.y = this.laserGreenPowerup.body.y;
      this.starSmallEmitter.start(true, 4000, null, 30);
      this.laserGreenPowerup.kill();
      shotsLeft = 50;
    },

    updateSpeed: function() {
      gameSpeed += 6;
    }
};

var wonState = {

  create: function() {

    var headingStyle = { font: "30px Arial", fill: "#ffffff" };
    var footerStyle = { font: "14px Arial", fill: "#ffffff" };

    var x = game.world.width/2;
    var y = game.world.height/2;
        
    this.headingText = this.game.add.text(x, y-50, "You Won!!! Congrats!!!", headingStyle);
    this.headingText.anchor.setTo(0.5, 0.5);

    this.footerText = this.game.add.text(x, y + 70, "Built with <3 in Banjarapalya", footerStyle);
    this.footerText.anchor.setTo(0.5, 0.5);

    this.helpText = this.game.add.text(x, y + 200, "PRESS SPACE TO RESTART", footerStyle);
    this.helpText.anchor.setTo(0.5, 0.5);


    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.start, this);

  },

  update: function() {

    this.footerText.angle += 2;

  },

  start: function() {
    window.location.reload();
  }

};

var failedState = {

  create: function() {

    var headingStyle = { font: "30px Arial", fill: "#ffffff" };
    var footerStyle = { font: "14px Arial", fill: "#ffffff" };

    var x = game.world.width/2;
    var y = game.world.height/2;
        
    this.headingText = this.game.add.text(x, y-50, "Game Over!!! Sorry!!!", headingStyle);
    this.headingText.anchor.setTo(0.5, 0.5);

    this.footerText = this.game.add.text(x, y + 70, "Built with <3 in Banjarapalya", footerStyle);
    this.footerText.anchor.setTo(0.5, 0.5);

    this.helpText = this.game.add.text(x, y + 200, "PRESS SPACE TO RESTART", footerStyle);
    this.helpText.anchor.setTo(0.5, 0.5);


    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.start, this); 

  },

  update: function() {

    this.footerText.angle += 2;

  },

  start: function() {
    window.location.reload();
  }

};

// states  
game.state.add('main', mainState);
game.state.add('failed', failedState);
game.state.add('won', wonState);

game.state.start('main');