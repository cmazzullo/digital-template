var bootstate = function (game) {

    function preload () {
	game.load.image('loading', 'assets/loading.png');
    }

    function create () {
	game.state.start('preloader');
    }

    return {preload: preload, create: create};
}
