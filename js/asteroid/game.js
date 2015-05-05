'use strict'

var gamestate = function(game) {
    var sprite;
    var cursors;
    var bullet;
    var bullets;
    var bulletTime = 0;
    var asteroids;

    var music;
    var explodefx;
    var bulletfx;
    var minefx;
    var deathfx;
    var explosion;
    var anim;

    var explode = function (sprite, asteroid) {
	explodefx.play();
	minefx.play();
	lives --;
	livestext.setText("Lives: " + lives);
	console.log('you lose');
	explosion = game.add.sprite(sprite.body.x, sprite.body.y, 'explosion');
	explosion.scale.x = .5;
	explosion.scale.y = .5;
	explosion.anchor.setTo(0.3, 0.6);
	anim = explosion.animations.add ("explode");
	anim.killOnComplete=true;
	anim.play();
	asteroid.body.x = -100;
	asteroid.kill();
	if (lives <= 0) {
	    music.stop();
	    deathfx.play();
	    game.state.start('lose');
	}

    }
    var score = 0;
    var scoretext;
    var maxscore = 100;
    var lives;
    var livestext;
    var heat = 10;
    var heattext;

    var mine = function (asteroid, bullet) {
	minefx.play();
	console.log('mining');
	score ++;
	scoretext.setText("Minerals: " + score);
	var explosion = game.add.sprite(asteroid.body.x, asteroid.body.y, 'explosion');
	explosion.anchor.setTo(0.3, 0.6);
	var anim = explosion.animations.add ("explode");
	anim.killOnComplete=true;
	anim.play();
	asteroid.kill();
	bullet.kill();
	if (score >= maxscore) {
	    music.stop();
	    game.state.start('win');
	}
    }

    function screenWrap (sprite) {
	if (sprite.x < 0)
	{
            sprite.x = game.width;
	}
	else if (sprite.x > game.width)
	{
            sprite.x = 0;
	}

	if (sprite.y < 0)
	{
            sprite.y = game.height;
	}
	else if (sprite.y > game.height)
	{
            sprite.y = 0;
	}
    }

    function create() {
	music = game.add.audio('music');
	music.play();
	lives = 5;
	score = 0;
	//  This will run in Canvas mode, so let's gain a little speed and display
	game.renderer.clearBeforeRender = false;
	game.renderer.roundPixels = true;

	//  We need arcade physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//  A spacey background
	game.add.tileSprite(0, 0, game.width, game.height, 'space');

	//  Our ships bullets
	bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;

	//  All 40 of them
	bullets.createMultiple(40, 'bullet');
	bullets.setAll('anchor.x', 0.5);
	bullets.setAll('anchor.y', 0.5);

	//  Our player ship
	sprite = game.add.sprite(300, 300, 'ship');
	sprite.anchor.set(0.5);

	//  and its physics settings
	game.physics.enable(sprite, Phaser.Physics.ARCADE);

	sprite.body.drag.set(100);
	sprite.body.maxVelocity.set(200);

	//  Game input
	cursors = game.input.keyboard.createCursorKeys();
	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

	// Emitter for asteroids
	var emit = function (key, period) {
	    var emitter = game.add.emitter(game.world.centerX, -50, 50);
	    emitter.width = game.world.width;
	    emitter.makeParticles(key, 1);
	    emitter.minParticleScale = 0.9;
	    emitter.maxParticleScale = 1.1;
	    emitter.setYSpeed(50, 100);
	    emitter.setXSpeed(-100, 100);
	    emitter.minRotation = -30;
	    emitter.maxRotation = 30;
	    emitter.start(false, 3200, period);
	    return emitter
	}

	asteroids = emit('asteroid', 300);

	// Show the score
	scoretext = game.add.text(
	    this.world.centerX - 350,
	    this.world.height - 100,
	    "",
	    {
		size: "72px",
		fill: "#eee",
		align: "center"
	    }
	);
	scoretext.setText("Minerals: " + score);

	livestext = game.add.text(
	    this.world.centerX - 350,
	    this.world.height - 150,
	    "",
	    {
		size: "72px",
		fill: "#fff",
		align: "center"
	    }
	);
	livestext.setText("Lives: " + lives);

	heattext = game.add.text(
	    this.world.centerX - 350,
	    this.world.height - 200,
	    "",
	    {
		size: "72px",
		fill: "#fff",
		align: "center"
	    }
	);
	heattext.setText("Heat: " + heat);

	// Add sound
	explodefx = game.add.audio('squit');
	bulletfx = game.add.audio('fire');
	minefx = game.add.audio('explode');
	deathfx = game.add.audio('death');


    }

    function update() {
	//console.log();
	if (cursors.up.isDown)
	{
            game.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
	}
	else
	{
            sprite.body.acceleration.set(0);
	}

	if (cursors.left.isDown)
	{
            sprite.body.angularVelocity = -300;
	}
	else if (cursors.right.isDown)
	{
            sprite.body.angularVelocity = 300;
	}
	else
	{
            sprite.body.angularVelocity = 0;
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
	{
            fireBullet();
	}

	screenWrap(sprite);

	bullets.forEachExists(screenWrap, this);

	// Overlap
	game.physics.arcade.overlap(asteroids, sprite, explode, null, this);
	game.physics.arcade.overlap(asteroids, bullets, mine, null, this);

	// Collision
	game.physics.arcade.collide(asteroids, sprite);
	game.physics.arcade.collide(asteroids, asteroids);

    }

    function fireBullet () {
	if (game.time.now > bulletTime)
	{
            bullet = bullets.getFirstExists(false);

            if (bullet)
            {
		bulletfx.play();
		bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
		bullet.lifespan = 800;
		bullet.rotation = sprite.rotation;
		game.physics.arcade.velocityFromRotation(sprite.rotation, 200, bullet.body.velocity);
		bulletTime = game.time.now + 250;
            }
	}

    }
    return {create: create, update: update};
}
