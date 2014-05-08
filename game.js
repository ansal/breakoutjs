var game = new Phaser.Game(700, 500, Phaser.AUTO, 'gameDiv');

var mainState = {

    preload: function() { 

      this.game.load.image('paddle', 'assets/paddle.png');
      this.game.load.image('ballBlue', 'assets/ballBlue.png');
      this.game.load.image('hbar', 'assets/hbar.png');
      this.game.load.image('vbar', 'assets/vbar.png');
    },

    create: function() { 

      this.game.stage.backgroundColor = '#5e3f6b';
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      // horizontal boundry
      this.hbarTop = this.game.add.sprite(0, -5, 'hbar');
      this.game.physics.arcade.enable(this.hbarTop);
      this.hbarTop.body.immovable = true;

      // vertical boundaries

      // left bar
      this.vbarLeft = this.game.add.sprite(0, 0, 'vbar');
      this.game.physics.arcade.enable(this.vbarLeft);
      this.vbarLeft.body.immovable = true;

      // right bar
      this.vbarRight = this.game.add.sprite(693, 0, 'vbar');
      this.game.physics.arcade.enable(this.vbarRight);
      this.vbarRight.body.immovable = true;      

      // paddle
      this.paddle = this.game.add.sprite(700 / 2 - 80, 450, 'paddle');
      this.game.physics.arcade.enable(this.paddle);
      this.paddle.body.collideWorldBounds = true;
      this.paddle.body.immovable = true;
      this.paddle.anchor.setTo(0.5, 0.5);

      // ball
      this.ballBlue = this.game.add.sprite(700 / 2, 50, 'ballBlue');
      this.game.physics.arcade.enable(this.ballBlue);
      this.ballBlue.body.velocity.y = 300;
      this.ballBlue.anchor.set(0.5);

      this.cursors = game.input.keyboard.createCursorKeys();

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
      this.ballBlue.body.velocity.y = -300;
    },

    ballHitTop: function() {
      this.ballBlue.body.velocity.y = 300;
    },

    ballHitLeft: function() {
      this.ballBlue.body.velocity.x = 300;
    },

    ballHitRight: function() {
      this.ballBlue.body.velocity.x = -300;
    }
    
};

game.state.add('main', mainState);  
game.state.start('main');