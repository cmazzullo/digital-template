"use strict"

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');

var platforms;
var bg;
var player;
var toast;
var playerAction;
var cursors;
var jumpButton;
var player_speed = 700;
var jump_speed = -600;
var gravity = 3000;
var toast_gravity = -3;
var first = function(game) {};

first.prototype = {
    preload: function() {
	this.game.load.image("loading", "assets/loading.png");
    },
    create: function() {
	this.game.state.start("Boot");
    }
}

game.state.add("First", first);

var boot = function(game) {};

boot.prototype = {
    preload: function() {
	this.game.load.image('win', 'assets/win.png');
	this.game.load.image("loading", "assets/loading.png");
	var loadingBar = this.add.sprite(160,240,"loading");
	loadingBar.anchor.setTo(0.5,0.5);
	this.load.setPreloadSprite(loadingBar);

	this.game.load.image('ground', 'assets/platform.png');
	this.game.load.image("main", "assets/background3.png");
	this.game.load.tilemap('level1', 'assets/level1.json', null,
			       Phaser.Tilemap.TILED_JSON);
	this.game.load.image('tiles-1', 'assets/tiles-1.png');
	this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	this.game.load.spritesheet('butter', 'assets/butter.png', 26, 48);
	this.game.load.spritesheet('toast', 'assets/toast.png', 50, 50);
	this.game.load.spritesheet('droid', 'assets/droid.png', 32, 32);
	this.game.load.image('starSmall', 'assets/star.png');
	this.game.load.image('starBig', 'assets/star2.png');
	this.game.load.image('background', 'assets/background2.png');
    },
    create: function() {


	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	this.game.stage.backgroundColor = '#FF0000';
	this.game.state.start("Menu");
    }
}

game.state.add("Boot", boot);

var menu = function(game) {};

menu.prototype = {
    create: function() {
	game.stage.backgroundColor = '#0000FF';
	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	jumpButton.onDown.add(function () {
	    game.state.start("Main");
	});
    }
}

game.state.add("Menu", menu);

var main = function(game) {};

var collect_toast = function () {
    game.state.start("Win");
}

main.prototype = {
    create: function() {

	this.game.stage.backgroundColor = '#111111';
	// bg = game.add.tileSprite(0, 0, 800, 600, 'background');

	game.input.mouse.enabled = false;
	game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

	cursors = game.input.keyboard.createCursorKeys();
	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	game.physics.startSystem(Phaser.Physics.ARCADE);

	toast = game.add.sprite(400, 400, 'toast');
	game.physics.enable(toast, Phaser.Physics.ARCADE);
	toast.body.collideWorldBounds = true;
	toast.body.setSize(20, 32, 5, 16);
	toast.body.gravity.y = toast_gravity;

	player = game.add.sprite(32, 32, 'butter');
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.collideWorldBounds = true;
	player.body.setSize(20, 32, 5, 16);

	//  A simple background for our game
	// game.add.sprite(0, 0, 'sky');

	//  The platforms group contains the ground and the 2 ledges we can jump on
	platforms = game.add.group();
	//  We will enable physics for any object that is created in this group
	platforms.enableBody = true;
	// Here we create the ground.
	var ground = platforms.create(0, game.world.height - 64, 'ground');
	//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
	ground.scale.setTo(2, 2);
	ground.body.immovable = true;
	// platforms.create(400, 400, 'ground').body.immovable = true;
	// platforms.create(-150, 250, 'ground').body.immovable = true;
	// platforms.create(150, 150, 'ground').body.immovable = true;
	var make_platform = function (x, y) {
	    platforms.create(x, y, 'ground').body.immovable = true;
	}
	make_platform(400, 400);
	make_platform(-150, 250);
	make_platform(150, 150);


	player.body.gravity.y = gravity;

    },
    update: function() {
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.overlap(player, toast, collect_toast, null, this);
	player.body.velocity.x = 0;
        if (cursors.left.isDown)
	{
            player.body.velocity.x = -player_speed;
	}
	else if (cursors.right.isDown)
	{
            player.body.velocity.x = player_speed;
	}
	if (jumpButton.isDown && player.body.touching.down)
	{
            player.body.velocity.y = jump_speed;
	}
    }
}

game.state.add("Main", main);

var win = function(game) {};

win.prototype = {
    create: function() {
	game.add.sprite(0, 0, 'win');
	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	jumpButton.onDown.add(function () {
	    game.state.start("Main");
	});
    }
}

game.state.add("Win", win);



game.state.start("First");
