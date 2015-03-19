'use strict'

var width = 640;
var height = 480;

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
		game.load.tilemap('map', 'assets/maze/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('tile_image', 'assets/maze/tileset.png');
		game.load.spritesheet('demon', 'assets/maze/demon.png', 10, 15);
		game.load.spritesheet('player', 'assets/maze/player.png', 10, 15);
		game.load.spritesheet('portal', 'assets/maze/portal.png', 10, 10);
		game.load.image('player_win', 'assets/maze/player_win.png', 640, 480);
		game.load.image('demon_win', 'assets/maze/demon_win.png', 640, 480);
	    },
	    create: function () {
		game.state.start('main');
	    }
	};
    },

    function (game) {
	var map;
	var bg;
	var fg;
	var player;
	var demon;
	var cursors;
	var grav = 100;
	var portal;

	// KEYS
	var w;
	var a;
	var s;
	var d;

	var up;
	var down;
	var left;
	var right;

	var tag;
	var take_portal;

	return {
	    name: 'main',
	    create: function () {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		// Add Map
		map = game.add.tilemap('map');
		map.addTilesetImage('tileset', 'tile_image');
		bg = map.createLayer('bg');
		fg = map.createLayer('fg');
		map.setCollisionBetween(1, 2000, true, 'fg');
		bg.resizeWorld();

		//Add players
		player = game.add.sprite(610, 448, 'player');
		demon = game.add.sprite(578, 448, 'demon');
		portal = game.add.sprite(16, 0, 'portal');
		game.physics.arcade.enable(player);
		//player.body.gravity.y = 300;
		game.physics.arcade.enable(demon);
		game.physics.arcade.enable(portal);


		// Add Keys
		w = game.input.keyboard.addKey(Phaser.Keyboard.W);
		w.onDown.add(function () {
		    player.body.gravity.y = -grav;
		    player.body.gravity.x = 0;
		});
		a = game.input.keyboard.addKey(Phaser.Keyboard.A);
		a.onDown.add(function () {
		    player.body.gravity.x = -grav;
		    player.body.gravity.y = 0;
		});
		s = game.input.keyboard.addKey(Phaser.Keyboard.S);
		s.onDown.add(function() {
		    player.body.gravity.y = grav;
		    player.body.gravity.x = 0;
		})
		d = game.input.keyboard.addKey(Phaser.Keyboard.D);
		d.onDown.add(function () {
		    player.body.gravity.x = grav;
		    player.body.gravity.y = 0;
		});

		up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		up.onDown.add(function () {
		    demon.body.gravity.y = -grav;
		    demon.body.gravity.x = 0;
		});
		left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		left.onDown.add(function () {
		    demon.body.gravity.x = -grav;
		    demon.body.gravity.y = 0;
		});
		down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		down.onDown.add(function() {
		    demon.body.gravity.y = grav;
		    demon.body.gravity.x = 0;
		});
		right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		right.onDown.add(function () {
		    demon.body.gravity.x = grav;
		    demon.body.gravity.y = 0;
		});

		tag = function() {game.state.start('player_wins');};
		take_portal = function() {game.state.start('demon_wins');};

	    },
	    update: function() {
		//collision
		game.physics.arcade.collide(player, fg);
		game.physics.arcade.collide(demon, fg);
		game.physics.arcade.overlap(player, demon, tag, null, this);
		game.physics.arcade.overlap(demon, portal, take_portal, null, this);
	    }
	}
    },
    function (game) {
	var jumpButton;
	return {
	    name: 'player_wins',
	    create: function () {
		game.add.sprite(0, 0, 'player_win');
		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		jumpButton.onDown.add(function () {
		    game.state.start("main");
		});
	    }
	};
    },

    function (game) {
	var jumpButton;
	return {
	    name: 'demon_wins',
	    create: function () {
		game.add.sprite(0, 0, 'demon_win');
		jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		jumpButton.onDown.add(function () {
		    game.state.start("main");
		});
	    }
	};
    }

];

states.forEach( function (e) { game.state.add(e().name, e) } )

game.state.start(states[0]().name);
