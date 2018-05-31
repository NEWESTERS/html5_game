let GAME_WIDTH, GAME_HEIGHT

window.onload = function() {
	const canvas = document.getElementById("game-canvas")
	GAME_WIDTH = canvas.width
	GAME_HEIGHT = canvas.height
	
	const game = new Game(canvas)

	game.start();

	(function update () {
		game.update()
		requestAnimationFrame(update)
	})()
}





