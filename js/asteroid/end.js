var win = function (game) {
    return {
	create: function () {
	    game.add.sprite(0, 0, 'win');
	    var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	    space.onDown.add(function () {
		game.state.start("game");
	    });
	}
    }
}

var lose = function (game) {
    return {
	create: function () {
	    game.add.sprite(0, 0, 'lose');
	    var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	    space.onDown.add(function () {
		game.state.start("game");
	    });
	}
    }
}
