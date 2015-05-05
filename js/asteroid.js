var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('space', 'assets/starfield.jpg');
    game.load.image('bullet', 'assets/bullets.png');
    game.load.image('ship', 'assets/ship.png');
    game.load.spritesheet('asteroid', 'assets/asteroid.png', 70, 70);
    game.load.spritesheet('explosion', 'assets/explosion.png', 128, 128);
}

var sprite;
var cursors;

var bullet;
var bullets;
var bulletTime = 0;
var asteroids;
var explode = function (sprite, asteroid) {
    lives --;
    livestext.setText("Lives: " + lives);
    console.log('you lose');
    var explosion = game.add.sprite(sprite.body.x, sprite.body.y, 'explosion');
    explosion.scale.x = .5;
    explosion.scale.y = .5;
    explosion.anchor.setTo(0.3, 0.6);
    anim = explosion.animations.add ("explode");
    anim.killOnComplete=true;
    //explosion.animations.play("explode");
    anim.play();
    asteroid.kill();
    //sprite.kill();
}

var score = 0;
var scoretext;
var lives = 10;
var livestext;
var heat = 10;
var heattext;


var mine = function (asteroid, bullet) {
    score ++;
    scoretext.setText("Minerals: " + score);
    var explosion = game.add.sprite(asteroid.body.x, asteroid.body.y, 'explosion');
    explosion.anchor.setTo(0.3, 0.6);
    anim = explosion.animations.add ("explode");
    anim.killOnComplete=true;
    anim.play();
    asteroid.kill();
    bullet.kill();
}


function create() {

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
	var emitter = game.add.emitter(game.world.centerX, -50, 500);
	emitter.width = game.world.width;
	emitter.makeParticles(key, 1);
	emitter.minParticleScale = 0.9;
	emitter.maxParticleScale = 1.1;
	emitter.setYSpeed(50, 100);
	emitter.setXSpeed(-5, 5);
	emitter.minRotation = -30;
	emitter.maxRotation = 30;
	emitter.start(false, 3200, period);
	return emitter
    }

    asteroids = emit('asteroid', 500);

    // Show the score
    scoretext = game.add.text(
	this.world.centerX - 100,
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
	this.world.centerX - 100,
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
	this.world.centerX - 100,
	this.world.height - 200,
	"",
	{
	    size: "72px",
	    fill: "#fff",
	    align: "center"
	}
    );
    heattext.setText("Heat: " + heat);

}

function update() {

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

}

function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
            bullet.lifespan = 200;
            bullet.rotation = sprite.rotation;
            game.physics.arcade.velocityFromRotation(sprite.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 500;
        }
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

function render() {
}
