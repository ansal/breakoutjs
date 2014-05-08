var game = new Phaser.Game(900, 600, Phaser.AUTO, 'gameDiv');
var gameSpeed = 300;

var mainState = {

    preload: function() { 

      this.game.load.image('paddle', 'assets/paddle.png');
      this.game.load.image('ballBlue', 'assets/ballBlue.png');
      this.game.load.image('ballGrey', 'assets/ballGrey.png');
      this.game.load.image('hbar', 'assets/hbar.png');
      this.game.load.image('vbar', 'assets/vbar.png');
      this.game.load.image('blueBlock', 'assets/blueBlock.png');
      this.game.load.image('greenBlock', 'assets/greenBlock.png');
      this.game.load.image('greyBlock', 'assets/greyBlock.png');
      this.game.load.image('purpleBlock', 'assets/purpleBlock.png');
      this.game.load.image('redBlock', 'assets/redBlock.png');
      this.game.load.image('yellowBlock', 'assets/yellowBlock.png');
      this.game.load.audio('bgMusic', 'assets/bg.mp3');
      this.game.load.audio('brickHit', 'assets/brickHit.ogg');
      this.game.load.audio('newBall', 'assets/newBall.ogg');
    },

    create: function() { 

      this.game.stage.backgroundColor = '#5e3f6b';
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      // horizontal boundry
      this.hbarTop = this.game.add.sprite(0, 0, 'hbar');
      this.game.physics.arcade.enable(this.hbarTop);
      this.hbarTop.body.immovable = true;

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
      this.paddle = this.game.add.sprite(900 / 2 - 80, 575, 'paddle');
      this.game.physics.arcade.enable(this.paddle);
      this.paddle.body.collideWorldBounds = true;
      this.paddle.body.immovable = true;
      this.paddle.anchor.setTo(0.5, 0.5);

      // bricks
      this.bricks = game.add.group();
      this.bricks.enableBody = true;
      var brickVelocity = 10;
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
      this.bgMusic = game.add.audio('bgMusic', 1, true);
      this.bgMusic.play('', 0, 1, true);

      // hit music
      this.brickHit = game.add.audio('brickHit');

      // new ball music
      this.newBall = game.add.audio('newBall');

      // balls
      this.balls = game.add.group();
      this.balls.enableBody = true;
      this.game.physics.arcade.enable(this.balls);
      this.createNewBall();


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
      this.game.physics.arcade.collide(this.balls, this.vbarLeft, this.ballHitLeft, null, this);
      this.game.physics.arcade.collide(this.balls, this.vbarRight, this.ballHitRight, null, this);
      this.game.physics.arcade.collide(this.balls, this.bricks, this.ballHitBricks, null, this);
     
    },

    createNewBall: function(){
      var ball = this.balls.create( Math.floor(Math.random() * (850 - 50 + 1)) + 50, 300, 'ballGrey');
      ball.body.velocity.y = gameSpeed;
      ball.anchor.set(0.5);
      ball.body.bounce.set(1);
      this.newBall.play();
    },

    ballHitPaddle: function(ball, paddle) {

      if(ball.x < paddle.x) {
        var diff = paddle.x - ball.x;
        ball.body.velocity.x = -10 * diff;
      } else if(ball.x > paddle.x) {
        var diff = ball.x - paddle.x;
        ball.body.velocity.x = 10 * diff;
      } else {
        ball.body.velocity.x = 2 + Math.random() * 8;
      }
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

      this.brickHit.play();
      brick.kill();
      gameSpeed += 2;

    },

    updateSpeed: function() {
      gameSpeed += 4;
    }
};

game.state.add('main', mainState);  
game.state.start('main');