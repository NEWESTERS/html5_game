function Game(canvas) {
	const ctx = canvas.getContext("2d")

	const player = new Player(ctx, canvas.width / 2, canvas.height / 2)
	let objects = []

	const modal = new Modal('modal')
	document.querySelector('#modal>.close-btn').onclick = function() {
		modal.toggle()
	}

	this.start = function() {
		let x, y, width, height
		let min = 10,
			max = 200

		for (let i = 15; i >= 0; i--) {
			x = Math.random() * (GAME_WIDTH)
			y = Math.random() * (GAME_HEIGHT)
			width = Math.random() * (max - min) + min
			height = Math.random() * (max - min) + min
			objects.push(new Brick(ctx, x, y, width, height, i))
		}

		let mouseDownEvent = new Event("keydown")
		let mouseUpEvent = new Event("keyup")
		let buttons = document.getElementsByClassName("button")

		Array.prototype.forEach.call(buttons, function(button) {
		    button.addEventListener("touchstart", _ => {
				mouseDownEvent.keyCode = button.getAttribute("value")
				document.dispatchEvent(mouseDownEvent)
			})

			button.addEventListener("mousedown", _ => {
				mouseDownEvent.keyCode = button.getAttribute("value")
				document.dispatchEvent(mouseDownEvent)
			})

			button.addEventListener("touchend", _ => {
				mouseUpEvent.keyCode = button.getAttribute("value")
				document.dispatchEvent(mouseUpEvent)
			})

			button.addEventListener("mouseup", _ => {
				mouseUpEvent.keyCode = button.getAttribute("value")
				document.dispatchEvent(mouseUpEvent)
			})
		})

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
		    	player.shoot()
		    } else if (e.keyCode == 13) {
		    	for (let i = objects.length - 1; i >= 0; i--) {
		    		if (objects[i].collision == player.direction) {
		    			modal.show(objects[i])
		    		}
		    	}		    	
		    }
		})

		document.addEventListener("keyup", e => {
			if (e.keyCode >= 37 && e.keyCode <= 40) {
				player.state = 'idle'
			}
		})

		this.update()
	}

	this.findCollisions = function() {
		// Find all collisions with player
		let finalCollision = {
			left: false,
			up: false,
			right: false,
			down: false
		}

		let collision = {}

		for (let i = objects.length - 1; i >= 0; i--) {
			collision = detectCollision(player, objects[i])

			if (collision.left) {
				objects[i].collision = 'left'
			} else if (collision.up) {
				objects[i].collision = 'up'
			} else if (collision.right) {
				objects[i].collision = 'right'
			} else if (collision.down) {
				objects[i].collision = 'down'
			} else {
				objects[i].collision = 'none'
			}

			finalCollision.left = (finalCollision.left + collision.left) ? true : false
			finalCollision.up = (finalCollision.up + collision.up) ? true : false
			finalCollision.right = (finalCollision.right + collision.right) ? true : false
			finalCollision.down = (finalCollision.down + collision.down) ? true : false
		}

		return finalCollision
	}

	this.update = function() {
		ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

		if (objects.length != 0) {
			for (let i = objects.length - 1; i >= 0; i--) {
				objects[i].draw()
			}
		}
		
		player.move(this.findCollisions())
	}
}