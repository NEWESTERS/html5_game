const GAME_WIDTH = 960
const GAME_HEIGHT = 540
// Base class for any object in the game
function GameObject(ctx, x, y) {
	this.x = x
	this.y = y
	this._ctx = ctx
}

function Brick (ctx, x, y, width, height) {	
	GameObject.apply(this, arguments)
	// Player fields
	this.width = width ? width : 100
	this.height = height ? height : 100
	this.isCollided = false
	 
	this.draw()
}
// Brick methods
(function() {
	// Draw brick
    this.draw = function() {
		this._ctx.beginPath()
		this._ctx.rect(
			this.x,
			this.y,
			this.width,
			this.height
		)
		if (this.isCollided == true) {
			this._ctx.fillStyle = "#990000"
		} else {
			this._ctx.fillStyle = "#009900"
		}
		this._ctx.fill()
		this._ctx.closePath()
	}
}).call(Brick.prototype)

function Player(ctx, new_x, new_y) {
	GameObject.apply(this, arguments)
	// Player fields
	this._speed = 10,
	this._frameNumber = 0,
	this._image = new Image()
	this._image.src = 'player.png'

	this.height = 100
	this.width = this.height / 1.4
	this.direction = 'none'
	this.state = 'idle'	
	// Init draw
	this._draw()
}
// Player methods
(function() {
	// Next frame number for animation
	this._nextFrame = function() {
		if (this._frameNumber < 19) {
			this._frameNumber ++
		} else {
			this._frameNumber = 0
		}
	}
	// Draw player
	this._draw = function() {
		let sx = 0, sy = 0

		if (this.direction == 'left') sy = 410
		else if (this.direction == 'right') sy = 605
		else if (this.direction == 'up') sy = 210
		else if (this.direction == 'down') sy = 0

		if (this.state != 'idle') sx = 135 * Math.floor(this._frameNumber / 5)

        this._ctx.drawImage(
        	this._image,
        	sx,
        	sy,
        	135,
        	200,
        	this.x,
        	this.y,
        	this.width,
        	this.height
        )

        this._nextFrame()
	}
	// Change player attributes while moving
    this.move = function(collision) {
		if (this.state == 'walk') {
			if (this.direction == 'left' && this.x >= 0 && !collision.left) {
				this.x -= this._speed
			} else if (this.direction == 'right' && this.x <= GAME_WIDTH - this.width && !collision.right) {
				this.x += this._speed
			} else if (this.direction == 'up' && this.y >= 0 && !collision.up) {
				this.y -= this._speed
				// Perspective simulation
				this._speed -= .1
				this.height -= .75
				this.width = this.height / 1.4
			} else if (this.direction == 'down' && this.y <= GAME_HEIGHT - this.height && !collision.down) {
				this.y += this._speed
				// Perspective simulation
				this._speed += .1
				this.height += .75
				this.width = this.height / 1.4
			}
		}

		this._draw()        
	}
}).call(Player.prototype)

function detectCollision(objA, objB) {
	// Collision directions for objA
	let collision = {
		left: false,
		up: false,
		right: false,
		down: false
	}

	if (!(objA.y < objB.y && objA.y + objA.height < objB.y) &&
		!(objA.y > objB.y + objB.height && objA.y + objA.height > objB.y + objB.height)) {
		if (objA.x <= objB.x + objB.width && objA.x > objB.x && objA) {
			collision.left = true
		}

		if (objA.x + objA.width >= objB.x && objA.x < objB.x) {
			collision.right = true
		}
	}

	if (!(objA.x < objB.x && objA.x + objA.width < objB.x) &&
		!(objA.x > objB.x + objB.width && objA.x + objA.width > objB.x + objB.width)) {
		if (objA.y <= objB.y + objB.height && objA.y > objB.y) {
			collision.up = true
		}

		if (objA.height + objA.y >= objB.y && objA.y < objB.y) {
			collision.down = true
		}
	}

	return collision
}

window.onload = _ => {
	const canvas = document.getElementById("myCanvas")
	const ctx = canvas.getContext("2d")

	const player = new Player(ctx, canvas.width / 2, canvas.height / 2)
	const brick1 = new Brick(ctx, 200, 200, 200, 50)
	const brick2 = new Brick(ctx, 700, 400, 50, 50)
	let objects = [brick1, brick2]

	document.addEventListener("keydown", e => {
		if(e.keyCode == 37) {
	        player.direction = 'left'
	        player.state = 'walk'
	    } else if (e.keyCode == 39) {
	    	player.direction = 'right'
	    	player.state = 'walk'
	    } else if(e.keyCode == 38) {
	        player.direction = 'up'
	        player.state = 'walk'
	    } else if (e.keyCode == 40) {
	    	player.direction = 'down'
	    	player.state = 'walk'
	    }
	})

	document.addEventListener("keyup", e => {
		player.state = 'idle'
	});
	
	(function update() {
		ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

		let finalCollision = {
			left: false,
			up: false,
			right: false,
			down: false
		}

		let collision = {}
		// Find all collisions with player
		for (let i = objects.length - 1; i >= 0; i--) {
			collision = detectCollision(player, objects[i])

			if (collision.left || collision.up || collision.right || collision.down) {
				objects[i].isCollided = true
			} else {
				objects[i].isCollided = false
			}

			finalCollision.left = (finalCollision.left + collision.left) ? true : false
			finalCollision.up = (finalCollision.up + collision.up) ? true : false
			finalCollision.right = (finalCollision.right + collision.right) ? true : false
			finalCollision.down = (finalCollision.down + collision.down) ? true : false
		}

		brick1.draw()
		brick2.draw()
		player.move(finalCollision)
		requestAnimationFrame(update)
	})()
}





