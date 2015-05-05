var preloader = function (game) {
    return {
	name: 'preload',
	preload: function () {
	    game.load.image('loading', 'assets/loading.png');
	    var loadingBar = game.add.sprite(game.width/2,game.height/2,'loading');
	    loadingBar.anchor.setTo(0.5,0.5);
	    game.load.setPreloadSprite(loadingBar);
	    game.load.audio('music', 'js/asteroid/assets/music.ogg');
	    game.load.audio('ping', 'assets/SoundEffects/pickup.wav');
	    game.load.audio('squit', 'assets/SoundEffects/boss_hit.wav');
	    game.load.audio('explode', 'assets/SoundEffects/explode1.wav');
	    game.load.audio('fire', 'assets/SoundEffects/lazer.wav');
	    game.load.audio('mine', 'assets/SoundEffects/lazer.wav');
	    game.load.audio('death', 'assets/SoundEffects/sentry_explode.wav');
	    game.load.image('win', 'js/asteroid/assets/win.png');
	    game.load.image('lose', 'js/asteroid/assets/lose.png');
	    game.load.image('menu', 'js/asteroid/assets/menu.png');
	    game.load.image('loading', 'assets/loading.png');
	    game.load.image('bg', 'assets/ex-bg.png');
	    game.load.spritesheet('toast', 'assets/toast.png', 50, 50);
	    game.load.spritesheet('butter', 'assets/butter.png', 26, 48);
	    game.load.spritesheet('car', 'assets/car.png', 22, 49);
	    game.load.spritesheet('car2', 'assets/car2.png', 50, 50);
	    game.load.spritesheet('mad', 'assets/mad.png', 50, 50);
	    game.load.spritesheet('ticket', 'assets/ticket.png', 50, 50);
	    game.load.spritesheet('ticket2', 'assets/ticket2.png', 50, 50);
	    game.load.spritesheet('donut', 'assets/donut.png', 50, 50);
	    game.load.image('space', 'js/asteroid/assets/starfield.jpg');
	    game.load.image('bullet', 'js/asteroid/assets/bullets.png');
	    game.load.image('ship', 'js/asteroid/assets/ship.png');
	    game.load.spritesheet('asteroid', 'js/asteroid/assets/asteroid.png', 70, 70);
	    game.load.spritesheet('explosion', 'js/asteroid/assets/explosion.png', 128, 128);

	},
	create: function () {
	    game.state.start('menu');
	}
    };
}
