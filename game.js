var game = new Phaser.Game(900, 600, Phaser.AUTO, 'gameDiv');
var gameSpeed = 300;

var mainState = {

    preload: function() { 

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


      // game sounds

      this.game.load.audio('bgMusic', 'assets/bg.ogg');
      this.game.load.audio('paddleHit', 'assets/paddleHit.ogg');
      this.game.load.audio('brickHit', 'assets/brickHit.ogg');
      this.game.load.audio('newBall', 'assets/newBall.ogg');
      this.game.load.audio('ballCrash', 'assets/ballCrash.ogg');
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
      var brickVelocity = 8;
      var newBrick;
      for (var i = 1; i <= 12; i++) {
        newBrick = this.bricks.create( i * 63, 60, 'greenBlock');
        newBrick.body.velocity.y = brickVelocity;
      }
      for (i = 1; i <= 12; i++) {
        newBrick = this.bricks.create( i * 63, 95, 'purpleBlock');
        newBrick.body.velocity.y = brickVelocity;
      }
      for (i = 1; i <= 12; i++) {
        newBrick = this.bricks.create( i * 63, 130, 'redBlock');
        newBrick.body.velocity.y = brickVelocity;
      }
      for (i = 1; i <= 12; i++) {
        newBrick = this.bricks.create( i * 63, 165, 'yellowBlock');
        newBrick.body.velocity.y = brickVelocity;
      }
      for (i = 1; i <= 12; i++) {
        newBrick = this.bricks.create( i * 63, 200, 'blueBlock');
        newBrick.body.velocity.y = brickVelocity;
      }
      for (i = 1; i <= 12; i++) {
        newBrick = this.bricks.create( i * 63, 235, 'greyBlock');
        newBrick.body.velocity.y = brickVelocity;
      }

      // background music
      this.bgMusic = game.add.audio('bgMusic', 0.2, true);
      this.bgMusic.play();

      // paddle hit music
      this.paddleHit = game.add.audio('paddleHit');

      // brick hit music
      this.brickHit = game.add.audio('brickHit');

      // new ball music
      this.newBall = game.add.audio('newBall');

      // ball crash music
      this.ballCrash = game.add.audio('ballCrash');

      // balls
      this.balls = game.add.group();
      this.balls.enableBody = true;
      this.game.physics.arcade.enable(this.balls);
      this.createNewBall();

      this.starEmitter = game.add.emitter(0, 0, 100);
      this.starEmitter.makeParticles('particleStar');
      this.starEmitter.gravity = 200;

      this.starSmallEmitter = game.add.emitter(0, 0, 100);
      this.starSmallEmitter.makeParticles('particleSmallStar');
      this.starSmallEmitter.gravity = 200;


      // keyboard input
      this.cursors = game.input.keyboard.createCursorKeys();

      // timer
      this.game.time.events.loop(Phaser.Timer.SECOND, this.updateSpeed, this);
      this.game.time.events.loop(3000, this.createNewBall, this);

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

     
      this.game.physics.arcade.collide(this.balls, this.paddle, this.ballHitPaddle, null, this);
      this.game.physics.arcade.collide(this.balls, this.hbarTop, this.ballHitTop, null, this);
      this.game.physics.arcade.collide(this.balls, this.hbarBottom, this.ballHitBottom, null, this);
      this.game.physics.arcade.collide(this.balls, this.vbarLeft, this.ballHitLeft, null, this);
      this.game.physics.arcade.collide(this.balls, this.vbarRight, this.ballHitRight, null, this);
      this.game.physics.arcade.collide(this.balls, this.bricks, this.ballHitBricks, null, this);
      this.game.physics.arcade.collide(this.hbarBottom, this.bricks, this.brickHitBottom, null, this);
     
    },

    createNewBall: function(){
      var randomNum = Math.floor(Math.random() * (850 - 50 + 1)) + 50;
      var ballType;
      if(randomNum % 2 === 0) {
        ballType = 'ballGrey';
      } else {
        ballType = 'ballBlue';
      }
      var ball = this.balls.create( randomNum, 300, ballType);
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
      gameSpeed += 5;

      if (this.bricks.countLiving() === 0) {
        console.log('You Won');
      }

    },

    brickHitBottom: function(bottom, brick) {
      console.log('You lose');
    },

    updateSpeed: function() {
      //gameSpeed += 6;
    }
};

game.state.add('main', mainState);  
game.state.start('main');