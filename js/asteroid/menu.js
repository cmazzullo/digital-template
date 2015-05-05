var menu = function (game) {
    var create = function () {
	game.add.sprite(0, 0, 'menu');
	var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	space.onDown.add(function() {
	    game.state.start('game');
	});
    }
    return {create: create};
}
