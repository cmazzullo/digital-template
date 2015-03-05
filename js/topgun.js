'use strict'

var width = 160;
var height = 144;

var game = new Phaser.Game(width, height, Phaser.CANVAS, 'game');

var states = [
    function (game) {
	return {
	    name: 'boot',
	    preload: function () {
		game.load.image('loading', 'assets/loading.png');
	    },
	    create: function () {
		game.state.start('preload');
	    }
	};
    },
    function (game) {
	return {
	    name: 'preload',
	    preload: function () {
		game.load.image('loading', 'assets/loading.png');
		var loadingBar = game.add.sprite(width/2,height/2,'loading');
		loadingBar.anchor.setTo(0.5,0.5);
		game.load.setPreloadSprite(loadingBar);
		game.load.audio('ping', 'assets/SoundEffects/pickup.wav');
		game.load.audio('squit', 'assets/SoundEffects/numkey.wav');
		game.load.image('win', 'assets/win.png');
		game.load.image('lose', 'assets/lose.png');
		game.load.image('sky', 'assets/sky.png');
		game.load.image('menubg', 'assets/menu.png');
		game.load.image('loading', 'assets/loading.png');
		game.load.image('bg', 'assets/ex-bg.png');
		game.load.spritesheet('ship', 'assets/topgun/ship.png', 144, 160);
		game.load.spritesheet('smallbg', 'assets/topgun/smallbg.png', 144, 160);
		game.load.bitmapFont('desyrel', 'assets/topgun/desyrel.png',
				     'assets/topgun/desyrel.xml');
	    },
	    create: function () {
		game.state.start('main');
	    }
	};
    },
    function (game) {
	var ship;
	var x;
	var y;
	var z = 60;
	var cursors;
	var textStyle = { font: '64px Desyrel', align: 'center'};
	var timer = Phaser.Timer(game);
	var timertext;
	var seconds = 0;
	var minutes = 0;
	var totaltime = 30;
	var totalsecs;
	var field = Math.PI/2;
	var scale;

	return {
	    name: 'main',
	    create: function () {
		game.add.sprite(0, 0, 'smallbg');
		ship = game.add.sprite(width/2, height/2, 'ship');
		game.physics.enable(ship, Phaser.Physics.ARCADE);
		cursors = game.input.keyboard.createCursorKeys();
		ship.scale.setTo(.1, .1);
		timertext = game.add.bitmapText(10, 10, 'desyrel');
		game.time.reset();
	    },
	    update: function() {
		scale = Math.atan(width/z/20)/field;
		ship.scale.setTo(scale, scale);
		totalsecs = Math.floor(game.time.totalElapsedSeconds());
		seconds = totaltime - totalsecs;
		z = seconds;
		if (seconds < 10) seconds = '0' + seconds;
		timertext.setText(seconds);
		if (z <= 0) game.state.start('lose');
		ship.body.velocity.x = 0;
		ship.body.velocity.y = 0;
		if (cursors.left.isDown)
		{
		    ship.body.velocity.x = -a;
		}
		if (cursors.right.isDown)
		{
		    ship.body.velocity.x = a;
		}
		if (cursors.up.isDown)
		{
		    ship.body.velocity.y = -a;
		}
		if (cursors.down.isDown)
		{
		    ship.body.velocity.y = a;
		}

	    }
	}
    },
    function (game) {
	var spc;
	return {
	    name: 'lose',
	    create: function () {
		game.add.sprite(0, 0, 'lose');
		spc = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spc.onDown.add(function () {game.state.start("main");});
	    }
	};
    }
];

states.forEach( function (e) { game.state.add(e().name, e) } )

game.state.start(states[0]().name);
