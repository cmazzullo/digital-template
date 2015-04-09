"use strict"

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');

var platforms;
var bg;
var player;
var toast;
var playerAction;
var cursors;
var jumpButton;
var player_speed = 400;
var jump_speed = -400;
var gravity = 700;
var toast_gravity = 50;
var first = function(game) {};
var fx;
var winfx;

first.prototype = {
    preload: function() {
	this.game.load.image("loading", "assets/loading.png");
    },
    create: function() {
	this.game.state.start("Loading");
    }
}

game.state.add("First", first);

var loading = function(game) {};

loading.prototype = {
    preload: function() {
	this.game.load.audio('ping', 'assets/SoundEffects/pickup.wav');
	this.game.load.audio('squit', 'assets/SoundEffects/numkey.wav');
	this.game.load.image('win', 'assets/win.png');
	this.game.load.image('lose', 'assets/lose.png');
	this.game.load.image('sky', 'assets/sky.png');
	this.game.load.image('menubg', 'assets/menu.png');
	this.game.load.image("loading", "assets/loading.png");
	var loadingBar = this.add.sprite(160,240,"loading");
	loadingBar.anchor.setTo(0.5,0.5);
	this.load.setPreloadSprite(loadingBar);
	this.game.load.image('ground', 'assets/platform.png');
	this.game.load.image("main", "assets/background3.png");
	this.game.load.image('tiles-1', 'assets/tiles-1.png');
	this.game.load.spritesheet('butter', 'assets/butter.png', 26, 48);
	this.game.load.spritesheet('toast', 'assets/toast.png', 50, 50);
	this.game.load.image('background', 'assets/background2.png');
    },
    create: function() {


	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	this.game.stage.backgroundColor = '#FF0000';
	this.game.state.start("Menu");
    }
}

game.state.add("Loading", loading);

var menu = function(game) {};

menu.prototype = {
    create: function() {
	game.stage.backgroundColor = '#0000FF';
	bg = game.add.tileSprite(0, 0, 800, 600, 'menubg');
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

var die = function () {
    game.state.start("Lose");
}

var prev = true; //touching the ground

main.prototype = {
    create: function() {

	this.game.stage.backgroundColor = '#111111';
	game.add.sprite(0, 0, 'sky');
	// bg = game.add.tileSprite(0, 0, 800, 600, 'background');

	cursors = game.input.keyboard.createCursorKeys();
	game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	game.physics.startSystem(Phaser.Physics.ARCADE);
	toast = game.add.sprite(3, 3, 'toast');
	game.physics.enable(toast, Phaser.Physics.ARCADE);
	toast.body.collideWorldBounds = true;
	toast.body.setSize(50, 32, 5, 16);
	toast.body.gravity.y = toast_gravity;
	toast.body.bounce.set(1);

	player = game.add.sprite(150, 600 - 96, 'butter');
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.collideWorldBounds = true;
	player.body.setSize(20, 32, 5, 16);

	//  The platforms group contains the ground and the 2 ledges we can jump on
	platforms = game.add.group();
	//  We will enable physics for any object that is created in this group
	platforms.enableBody = true;
	//var ground = platforms.create(0, game.world.height - 32, 'ground');
	//ground.scale.setTo(2, 2);
	//ground.body.immovable = true;
	var make_platform = function (x, y) {
	    platforms.create(x, y - 32, 'ground').body.immovable = true;
	}
	make_platform(100, 600); // ground, 1
	make_platform(400, 500);
	make_platform(500, 400);
	make_platform(100, 300);
	make_platform(400, 200);
	make_platform(-150, 100);


	player.body.gravity.y = gravity;
	fx = game.add.audio('squit');
	winfx = game.add.audio('ping');

    },
    update: function() {


	game.physics.arcade.collide(player, platforms);

	if (player.body.touching.down || player.body.touching.up)
	{
	    player.body.gravity.y = -player.body.gravity.y;
	}

	prev = player.body.touching.down;

	game.physics.arcade.collide(toast, platforms);
	game.physics.arcade.overlap(player, toast, collect_toast, null, this);
	if (player.position.y > (600 - 62) ) {
	    die();
	}
	if (player.position.y < (0) ) {
	    die();
	}
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
	    fx.play()
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
	winfx = game.add.audio('ping');
	winfx.play();
    }
}

game.state.add("Win", win);


var lose = function(game) {};

lose.prototype = {
    create: function() {
	game.add.sprite(0, 0, 'lose');
	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	jumpButton.onDown.add(function () {
	    game.state.start("Main");
	});
    }
}

game.state.add("Lose", lose);

game.state.start("First");
