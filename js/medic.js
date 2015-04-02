'use strict'

var width = 800;
var height = 600;

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
		game.load.spritesheet('player', 'assets/medic/player.png', 100, 100);
		game.load.spritesheet('cell', 'assets/medic/cell.png', 100, 100);
	    },
	    create: function () {
		game.state.start('main');
	    }
	};
    },

    function (game) {
    	// var map;
	var bg;
	var fg;
	var player;
	var cells;
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
	var player_speed = 100;

	var collect_cell = function(player, cell) {
	    cell.frame = 1;
	}

	return {
	    name: 'main',
	    create: function () {
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//Add players
		player = game.add.sprite(300, 200, 'player');
		game.physics.arcade.enable(player);
		// player.body.gravity.y = 30;
		player.body.collideWorldBounds = true;

		cursors = game.input.keyboard.createCursorKeys();

		cells = game.add.group();
		cells.enableBody = true;
		cells.collideWorldBounds = true;
		var make_cell = function (x, y) {
		    var cell = cells.create(x, y - 32, 'cell');
		    game.physics.arcade.enable(cell);
		    cell.body.collideWorldBounds = true;
		    cell.body.bounce.set = 1;
		    cell.body.gravity.y = 0;
		}
		make_cell(100, 100);
		make_cell(100, 200);
		make_cell(175, 250);
		make_cell(375, 350);
		make_cell(120, 500);
		make_cell(500, 120);

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

		tag = function() {game.state.start('player_wins');};
		take_portal = function() {game.state.start('demon_wins');};

	    },
	    update: function() {
		game.physics.arcade.overlap(player, cells, collect_cell, null, this);
		game.physics.arcade.collide(player, cells);

		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
		if (cursors.left.isDown)
		{
		    player.body.velocity.x = -player_speed;
		}
		else if (cursors.right.isDown)
		{
		    player.body.velocity.x = player_speed;
		}
		if (cursors.up.isDown)
		{
		    player.body.velocity.y = -player_speed;
		}
		else if (cursors.down.isDown)
		{
		    player.body.velocity.y = player_speed;
		}
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
