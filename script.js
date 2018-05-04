let GAME_WIDTH
let GAME_HEIGHT
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
	this.isMarked = false
	 
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
		if (this.isMarked == true) {
			this._ctx.fillStyle = "#990000"
		} else {
			this._ctx.fillStyle = "#009900"
		}
		this._ctx.fill()
		this._ctx.closePath()
	}

	this.mark = function() {
		if (this.isCollided) {
			this.isMarked = true
		}
	}
}).call(Brick.prototype)

function Player(ctx, new_x, new_y) {
	GameObject.apply(this, arguments)
	// Player fields
	this._speed = 10,
	this._frameNumber = 0,
	this._image = new Image()
	this._image.src = 'player.png'

	this.height = 50
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
		/*
		this._ctx.beginPath()
		this._ctx.rect(
			this.x,
			this.y,
			this.width,
			this.height
		)
		this._ctx.fillStyle = "#000099"
		
		this._ctx.fill()
		this._ctx.closePath()
		*/
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
				//this._speed -= .1
				//this.height -= .75
				this.width = this.height / 1.4
			} else if (this.direction == 'down' && this.y <= GAME_HEIGHT - this.height && !collision.down) {
				this.y += this._speed
				// Perspective simulation
				//this._speed += .1
				//this.height += .75
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

	if (!(objA.y - objA._speed < objB.y && objA.y + objA.height - objA._speed < objB.y) &&
		!(objA.y + objA._speed > objB.y + objB.height && objA.y + objA._speed + objA.height > objB.y + objB.height)) {
		if (objA.x - objA._speed < objB.x + objB.width && objA.x + objA._speed > objB.x && objA) {
			collision.left = true
		}

		if (objA.x + objA.width + objA._speed > objB.x && objA.x - objA._speed < objB.x) {
			collision.right = true
		}
	}

	if (!(objA.x - objA._speed < objB.x && objA.x + objA.width - objA._speed < objB.x) &&
		!(objA.x + objA._speed > objB.x + objB.width && objA.x + objA.width + objA._speed > objB.x + objB.width)) {
		if (objA.y - objA._speed < objB.y + objB.height && objA.y + objA._speed > objB.y) {
			collision.up = true
		}

		if (objA.height + objA.y + objA._speed > objB.y && objA.y - objA._speed < objB.y) {
			collision.down = true
		}
	}

	return collision
}

window.onload = _ => {
	const canvas = document.getElementById("myCanvas")
	const ctx = canvas.getContext("2d")
	GAME_WIDTH = canvas.width
	GAME_HEIGHT = canvas.height

	const player = new Player(ctx, canvas.width / 2, canvas.height / 2)

	let objects = []
	let x
	let y
	let width
	let height

	for (let i = 40; i >= 0; i--) {
		x = Math.random() * (GAME_WIDTH)
		y = Math.random() * (GAME_HEIGHT)
		width = Math.random() * 200
		height = Math.random() * 200
		objects.push(new Brick(ctx, x, y, width, height))
	}
	/*
	let objects = [new Brick(ctx, 195, 200, 200, 50),
				   new Brick(ctx, 693, 400, 50, 50),
				   new Brick(ctx, 693, 400, 50, 50)
	]
	*/

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
	    } else if (e.keyCode == 32) {
	    	for (var i = objects.length - 1; i >= 0; i--) {
	    		if (objects[i].isMarked && objects[i].isCollided) {
	    			objects.splice(i, 1)
	    		}
	    		objects[i].mark()
	    	}
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

		//objects[0].draw()
		//objects[1].draw()
		for (let i = objects.length - 1; i >= 0; i--) {
			objects[i].draw()
		}
		player.move(finalCollision)
		requestAnimationFrame(update)
	})()
}





