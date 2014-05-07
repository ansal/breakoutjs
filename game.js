var game = new Phaser.Game(700, 500, Phaser.AUTO, 'gameDiv');

var mainState = {

    preload: function() { 

      this.game.stage.backgroundColor = '#5e3f6b';
      this.game.load.image('paddle', 'assets/paddle.png'); 

    },

    create: function() { 

      this.paddle = this.game.add.sprite(700 / 2 - 80, 450, 'paddle');
      var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

    },

    update: function() {

    }
};

game.state.add('main', mainState);  
game.state.start('main');