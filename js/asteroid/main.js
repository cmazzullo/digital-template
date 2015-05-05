'use strict'

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');

game.state.add('boot', bootstate);
game.state.add('preloader', preloader);
game.state.add('menu', menu);
game.state.add('game', gamestate);
game.state.add('win', win);
game.state.add('lose', lose);

game.state.start('boot');
