let GAME_WIDTH, GAME_HEIGHT

// Base class for any object in the game
function GameObject(ctx, x, y) {
	this.x = x
	this.y = y
	this._ctx = ctx
}

function detectCollision(objA, objB) {
	// Collision directions for objA
	let collision = {
		left: false,
		up: false,
		right: false,
		down: false
	}

	if (!(objA.y - objA.speed < objB.y && objA.y + objA.height - objA.speed < objB.y) &&
		!(objA.y + objA.speed > objB.y + objB.height && objA.y + objA.speed + objA.height > objB.y + objB.height)) {
		if (objA.x - objA.speed < objB.x + objB.width && objA.x + objA.speed > objB.x && objA) {
			collision.left = true
		}

		if (objA.x + objA.width + objA.speed > objB.x && objA.x - objA.speed < objB.x) {
			collision.right = true
		}
	}

	if (!(objA.x - objA.speed < objB.x && objA.x + objA.width - objA.speed < objB.x) &&
		!(objA.x + objA.speed > objB.x + objB.width && objA.x + objA.width + objA.speed > objB.x + objB.width)) {
		if (objA.y - objA.speed < objB.y + objB.height && objA.y + objA.speed > objB.y) {
			collision.up = true
		}

		if (objA.height + objA.y + objA.speed > objB.y && objA.y - objA.speed < objB.y) {
			collision.down = true
		}
	}

	return collision
}

window.onload = _ => {
	const canvas = document.getElementById("myCanvas")
	GAME_WIDTH = canvas.width
	GAME_HEIGHT = canvas.height
	
	const game = new Game(canvas)

	game.start();

	(function update () {
		game.update()
		requestAnimationFrame(update)
	})()
}





