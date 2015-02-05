// mods by Patrick OReilly
// twitter: @pato_reilly

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('dog', 'assets/dog.png');
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

function myalert() {
    alert('hello');
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
    this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function () {processClick();}, this);
    this.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function () {player.y -= 100;}, this);
    this.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function () {player.y += 100;}, this);
    this.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(function () {player.x += 100;}, this);
    this.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(function () {player.x -= 100;}, this);
}

function update() {

    countDownTimer();

    // if (layer.getTileX(game.input.activePointer.worldX) <= 5) // to prevent the marker from going out of bounds
    // {
    //     marker.x = layer.getTileX(game.input.activePointer.worldX) * 100;
    //     marker.y = layer.getTileY(game.input.activePointer.worldY) * 100;
    // }

    if (flipFlag == true)
    {
        if (game.time.totalElapsedSeconds() - timeCheck > 0.5)
        {
            flipBack();
        }
    }
}


function countDownTimer() {

    var timeLimit = 120;

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
    game.debug.text(youWin, 620, 240, 'rgb(0,255,0)');

    game.debug.text('Time: ' + myCountdownSeconds, 620, 15, 'rgb(0,255,0)');

    //game.debug.text('squareCounter: ' + squareCounter, 620, 272, 'rgb(0,0,255)');
    game.debug.text('Matched Pairs: ' + masterCounter, 620, 304, 'rgb(0,0,255)');

    //game.debug.text('startList: ' + myString1, 620, 208, 'rgb(255,0,0)');
    //game.debug.text('squareList: ' + myString2, 620, 240, 'rgb(255,0,0)');


    game.debug.text('Tile: ' + map.getTile(layer.getTileX(player.x), layer.getTileY(player.y)).index, 620, 48, 'rgb(255,0,0)');

    game.debug.text('LayerX: ' + layer.getTileX(player.x), 620, 80, 'rgb(255,0,0)');
    game.debug.text('LayerY: ' + layer.getTileY(player.y), 620, 112, 'rgb(255,0,0)');

    game.debug.text('Tile Position: ' + currentTilePosition, 620, 144, 'rgb(255,0,0)');
    game.debug.text('Hidden Tile: ' + getHiddenTile(), 620, 176, 'rgb(255,0,0)');
}
