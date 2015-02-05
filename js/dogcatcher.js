// mods by Patrick OReilly
// twitter: @pato_reilly

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('game_over', 'assets/game_over.png');
    game.load.image('dog', 'assets/dog.png');
    game.load.image('catcher', 'assets/catcher.png');
    game.load.tilemap('matching', 'assets/phaser_tiles.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/phaser_tiles-numbered.png');//, 100, 100, -1, 1, 1);
}

var timeCheck = 0;
var flipFlag = false;

var startList = new Array();
var squareList = new Array();

var masterCounter = 0;
var squareCounter = 0;
var square1Num;
var square2Num;
var savedSquareX1;
var savedSquareY1;
var savedSquareX2;
var savedSquareY2;

var map;
var tileset;
var layer;

var currentTile;
var currentTilePosition;

var tileBack = 25;
var timesUp = '+';
var youWin = '+';

var myCountdownSeconds;
var tile_dim = 100;
var xtiles = 6;
var ytiles = 6;
var start_tile_x = 3;
var start_tile_y = 5
var player;
var score = 0;
var move_count = 0;

function moveCatcher() {
    if (player.y < catcher.y) {catcher.y -= tile_dim;}
    else if (player.y > catcher.y) {catcher.y += tile_dim;}
    else if (player.x < catcher.x) {catcher.x -= tile_dim;}
    else if (player.x > catcher.x) {catcher.x += tile_dim;}
}

function moveCatcher2() {
    if (player.y < catcher2.y) {catcher2.y -= tile_dim;}
    else if (player.y > catcher2.y) {catcher2.y += tile_dim;}
    else if (player.x < catcher2.x) {catcher2.x -= tile_dim;}
    else if (player.x > catcher2.x) {catcher2.x += tile_dim;}
}

function playerAction() {
    move_count++;
    if (move_count % 3 == 0) {
	moveCatcher();
	moveCatcher2();
    }
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.input.mouse.enabled = false;
    map = game.add.tilemap('matching');

    map.addTilesetImage('Desert', 'tiles');

    //tileset = game.add.tileset('tiles');

    layer = map.createLayer('Ground');//.tilemapLayer(0, 0, 600, 600, tileset, map, 0);
    game.world.setBounds(0, 0, xtiles * tile_dim, ytiles * tile_dim);
    randomizeTiles();

    player = game.add.sprite(0, 0, 'dog')
    game.physics.arcade.enable(player)
    //player.body.gravity.y = 300
    player.body.collideWorldBounds = true;
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function () {playerAction(); processClick();}, this);
    this.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function () {playerAction(); player.y -= 100;}, this);
    this.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function () {playerAction(); player.y += 100;}, this);
    this.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(function () {playerAction(); player.x += 100;}, this);
    this.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(function () {playerAction(); player.x -= 100;}, this);

    catcher = game.add.sprite(6 * tile_dim, 6 * tile_dim, 'catcher')
    game.physics.arcade.enable(catcher)
    catcher.body.collideWorldBounds = true;
    catcher2 = game.add.sprite(1 * tile_dim, 6 * tile_dim, 'catcher')
    game.physics.arcade.enable(catcher2)
    catcher2.body.collideWorldBounds = true;
}

function game_over() {
    game.add.sprite(0, 0, 'game_over');
}

function update() {

    countDownTimer();
    if ((player.x === catcher.x && player.y === catcher.y) || (player.x === catcher2.x && player.y === catcher2.y))
    {
	game_over();
    }
    if (myCountdownSeconds <= 0) {
	game_over();
    }
}

function countDownTimer() {

    var timeLimit = 30;

    mySeconds = game.time.totalElapsedSeconds();
    myCountdownSeconds = timeLimit - mySeconds;

    if (myCountdownSeconds <= 0)
    {
        // time is up
        timesUp = 'Time is up!';
    }
}

function processClick() {

    currentTile = map.getTile(layer.getTileX(player.x), layer.getTileY(player.y));
    currentTilePosition = ((layer.getTileY(player.y)+1)*6)-(6-(layer.getTileX(player.x)+1));

    // check to make sure the tile is not already flipped
    if (currentTile.index == tileBack)
    {
        // get the corresponding item out of squareList
        currentNum = squareList[currentTilePosition-1];
        flipOver();
        squareCounter++;
    }
    if (getHiddenTile() < 9)
    {
	score++;
    }
}

function flipOver() {

    map.putTile(currentNum, layer.getTileX(player.x), layer.getTileY(player.y));
}

function flipBack() {

    flipFlag = false;

    map.putTile(tileBack, savedSquareX1, savedSquareY1);
    map.putTile(tileBack, savedSquareX2, savedSquareY2);

}

function randomizeTiles() {

    for (num = 1; num <= 18; num++)
    {
        startList.push(num);
    }
    for (num = 1; num <= 18; num++)
    {
        startList.push(num);
    }

    // for debugging
    myString1 = startList.toString();

    // randomize squareList
    for (i = 1; i <=36; i++)
    {
        var randomPosition = game.rnd.integerInRange(0,startList.length - 1);

        var thisNumber = startList[ randomPosition ];

        squareList.push(thisNumber);
        var a = startList.indexOf(thisNumber);

        startList.splice( a, 1);
    }

    // for debugging
    myString2 = squareList.toString();

    for (col = 0; col < 6; col++)
    {
        for (row = 0; row < 6; row++)
        {
            map.putTile(tileBack, col, row);
        }
    }
}

function getHiddenTile() {

    thisTile = squareList[currentTilePosition-1];
    return thisTile;
}

function render() {

    game.debug.text(timesUp, 620, 208, 'rgb(0,255,0)');
    // game.debug.text(youWin, 620, 240, 'rgb(0,255,0)');

    game.debug.text('Time: ' + Math.round(myCountdownSeconds), 620, 15, 'rgb(0,255,0)');

    //game.debug.text('squareCounter: ' + squareCounter, 620, 272, 'rgb(0,0,255)');
    //game.debug.text('Matched Pairs: ' + masterCounter, 620, 304, 'rgb(0,0,255)');

    //game.debug.text('startList: ' + myString1, 620, 208, 'rgb(255,0,0)');
    //game.debug.text('squareList: ' + myString2, 620, 240, 'rgb(255,0,0)');


    // game.debug.text('Tile: ' + map.getTile(layer.getTileX(player.x), layer.getTileY(player.y)).index, 620, 48, 'rgb(255,0,0)');

    // game.debug.text('LayerX: ' + layer.getTileX(player.x), 620, 80, 'rgb(255,0,0)');
    // game.debug.text('LayerY: ' + layer.getTileY(player.y), 620, 112, 'rgb(255,0,0)');

    // game.debug.text('Move Count: ' + move_count, 620, 144, 'rgb(255,0,0)');
    game.debug.text('Score: ' + score, 620, 176, 'rgb(255,0,0)');
}
