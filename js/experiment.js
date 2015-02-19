'use strict'

var width = 400;
var height = 600;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game');

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
		game.load.spritesheet('toast', 'assets/toast.png', 50, 50);
		game.load.spritesheet('butter', 'assets/butter.png', 26, 48);
		game.load.spritesheet('car', 'assets/car.png', 22, 49);
		game.load.spritesheet('car2', 'assets/car2.png', 50, 50);
		game.load.spritesheet('mad', 'assets/mad.png', 50, 50);
		game.load.spritesheet('ticket', 'assets/ticket.png', 50, 50);
		game.load.spritesheet('ticket2', 'assets/ticket2.png', 50, 50);
		game.load.spritesheet('donut', 'assets/donut.png', 50, 50);
	    },
	    create: function () {
		game.state.start('main');
	    }
	};
    },
    function (game) {
	var score = 0;
	var complaints = 0;
	var toast;
	var cursors;
	var a = 200;
	var cars;
	var donuts;
	var scoretext;
	var livestext;
	return {
	    name: 'main',
	    create: function () {
		game.add.sprite(0, 0, 'bg');
		game.physics.startSystem(Phaser.Physics.ARCADE);
		toast = game.add.sprite(width/2, height/2, 'toast');
		game.physics.enable(toast, Phaser.Physics.ARCADE);
		toast.body.collideWorldBounds = true;
		toast.body.setSize(50, 32, 5, 16);
		toast.body.gravity.y = 0;
		toast.body.bounce.set(.5);
		scoretext = game.add.text(
		    this.world.centerX - 100,
		    this.world.height/2,
		    "",
		    {
			size: "72px",
			fill: "#000",
			align: "center"
		    }
		);
		livestext = game.add.text(
		    this.world.centerX - 100,
		    this.world.height/3,
		    "",
		    {
			size: "72px",
			fill: "#000",
			align: "center"
		    }
		);

		var spc = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		cursors = game.input.keyboard.createCursorKeys();
		var vel = 100;

		var emit = function (key, period) {
		    var emitter = game.add.emitter(game.world.centerX, 0, 500);
		    emitter.width = game.world.width;
		    emitter.makeParticles(key, 1);
		    emitter.minParticleScale = 0.9;
		    emitter.maxParticleScale = 1.1;
		    emitter.setYSpeed(100, 300);
		    emitter.setXSpeed(-5, 5);
		    emitter.minRotation = -30;
		    emitter.maxRotation = 30;
		    emitter.start(false, 3200, period);
		    return emitter
		}

		cars = emit('car', 5);
		donuts = emit('mad', 1000);
	    },
	    update: function() {
		var ticket = function (toast, car) {
		    if (car.frame === 1) {
			car.frame = 0;
			donuts.frequency -= 1;
			score++;
			scoretext.setText("TICKETS: " + score);
		    }
		}
		var mob = function (toast, mob) {
		    complaints += 1;
		    livestext.setText("COMPLAINTS: " + complaints);
		    if (complaints >= 10) { game.state.start('lose'); }
		    mob.kill();
		}
		game.physics.arcade.overlap(toast, cars, ticket, null, this);
		game.physics.arcade.overlap(toast, donuts, mob, null, this);
		game.physics.arcade.collide(toast, donuts);
		//game.physics.arcade.collide(cars, donuts);
		game.physics.arcade.collide(toast, cars);
		toast.body.velocity.x = 0;
		toast.body.velocity.y = 0;
		if (cursors.left.isDown)
		{
		    toast.body.velocity.x = -a;
		}
		if (cursors.right.isDown)
		{
		    toast.body.velocity.x = a;
		}
		if (cursors.up.isDown)
		{
		    toast.body.velocity.y = -a;
		}
		if (cursors.down.isDown)
		{
		    toast.body.velocity.y = a;
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
