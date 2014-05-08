var game = new Phaser.Game(900, 600, Phaser.AUTO, 'gameDiv');
var gameSpeed = 300;

var mainState = {

    preload: function() { 

      this.game.load.image('paddle', 'assets/paddle.png');
      this.game.load.image('ballBlue', 'assets/ballBlue.png');
      this.game.load.image('hbar', 'assets/hbar.png');
      this.game.load.image('vbar', 'assets/vbar.png');
      this.game.load.image('blueBlock', 'assets/blueBlock.png');
      this.game.load.image('greenBlock', 'assets/greenBlock.png');
      this.game.load.image('greyBlock', 'assets/greyBlock.png');
      this.game.load.image('purpleBlock', 'assets/purpleBlock.png');
      this.game.load.image('redBlock', 'assets/redBlock.png');
      this.game.load.image('yellowBlock', 'assets/yellowBlock.png');
      this.game.load.audio('bgMusic', 'assets/bg.mp3');
      this.game.load.audio('brickHit', 'assets/brickHit.wav');
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
      this.bricks.enableBody= true;
      for (var i = 1; i <= 12; i++) {
        this.bricks.create( i * 63, 50, 'blueBlock');
      }
      for (i = 1; i <= 12; i++) {
        this.bricks.create( i * 63, 85, 'greenBlock');
      }
      for (i = 1; i <= 12; i++) {
        this.bricks.create( i * 63, 120, 'greyBlock');
      }
      for (i = 1; i <= 12; i++) {
        this.bricks.create( i * 63, 155, 'purpleBlock');
      }
      for (i = 1; i <= 12; i++) {
        this.bricks.create( i * 63, 190, 'redBlock');
      }
      for (i = 1; i <= 12; i++) {
        this.bricks.create( i * 63, 225, 'yellowBlock');
      }

      // ball
      this.ballBlue = this.game.add.sprite(700 / 2, 250, 'ballBlue');
      this.game.physics.arcade.enable(this.ballBlue);
      this.ballBlue.body.velocity.y = gameSpeed;
      this.ballBlue.anchor.set(0.5);

      // keyboard input
      this.cursors = game.input.keyboard.createCursorKeys();

      // background music
      this.bgMusic = game.add.audio('bgMusic', 1, true);
      this.bgMusic.play('', 0, 1, true);

      // hit music
      this.brickHit = game.add.audio('brickHit');

      // timer
      this.game.time.events.loop(Phaser.Timer.SECOND, this.updateSpeed, this);

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

      // collisions
      this.game.physics.arcade.collide(this.ballBlue, this.paddle, this.ballHitPaddle, null, this);
      this.game.physics.arcade.collide(this.ballBlue, this.hbarTop, this.ballHitTop, null, this);
      this.game.physics.arcade.collide(this.ballBlue, this.vbarLeft, this.ballHitLeft, null, this);
      this.game.physics.arcade.collide(this.ballBlue, this.vbarRight, this.ballHitRight, null, this);
      this.game.physics.arcade.collide(this.ballBlue, this.bricks, this.ballHitBricks, null, this);

    },

    ballHitPaddle: function() {

      if(this.ballBlue.x < this.paddle.x) {
        var diff = this.paddle.x - this.ballBlue.x;
        this.ballBlue.body.velocity.x = -10 * diff;
      } else if(this.ballBlue.x > this.paddle.x) {
        var diff = this.ballBlue.x - this.paddle.x;
        this.ballBlue.body.velocity.x = 10 * diff;
      } else {
        this.ballBlue.body.velocity.x = 2 + Math.random() * 8;
      }
      this.ballBlue.body.velocity.y = -gameSpeed;
    },

    ballHitTop: function() {
      this.ballBlue.body.velocity.y = gameSpeed;
    },

    ballHitLeft: function() {
      this.ballBlue.body.velocity.x = gameSpeed;
    },

    ballHitRight: function() {
      this.ballBlue.body.velocity.x = -gameSpeed;
    },

    ballHitBricks: function(ball, brick) {
      this.brickHit.play();
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
      brick.kill();
      gameSpeed += 5;
    },

    updateSpeed: function() {
      gameSpeed += 10;
    }
};

game.state.add('main', mainState);  
game.state.start('main');