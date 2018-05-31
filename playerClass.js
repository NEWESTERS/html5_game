function Player(ctx, x, y) {
	GameObject.apply(this, arguments)
	// Player fields
	this.speed = 8
	this.frameNumber = 0
	this.image = new Image()
	this.image.src = 'player.png'
	this.bullets = []

	this.height = 100
	this.width = this.height / 1.4
	this.direction = 'down'
	this.state = 'idle'	
	// Init draw
	this.draw()
}
// Player methods
(function() {
	// Next frame number for animation
	this.nextFrame = function() {
		if (this.frameNumber < 19) {
			this.frameNumber ++
		} else {
			this.frameNumber = 0
		}
	}
	// Draw player
	this.draw = function() {
		for (let i = this.bullets.length - 1; i >= 0; i--) {
        	if (this.bullets[i].lifetime > 0) {
        		this.bullets[i].move()
        	} else {
        		this.bullets.splice(i, 1)
        	}
        }

		let sx = 0, sy = 0

		if (this.direction == 'left') sy = 410
		else if (this.direction == 'right') sy = 605
		else if (this.direction == 'up') sy = 210
		else if (this.direction == 'down') sy = 0

		if (this.state != 'idle') sx = 135 * Math.floor(this.frameNumber / 5)

        this.ctx.drawImage(
        	this.image,
        	sx,
        	sy,
        	135,
        	200,
        	this.x,
        	this.y,
        	this.width,
        	this.height
        )

        this.nextFrame()
	}
	// Change player attributes while moving
    this.move = function(collision) {
		if (this.state == 'walk') {
			if (this.direction == 'left' && this.x >= 0 && !collision.left) {
				this.x -= this.speed
			} else if (this.direction == 'right' && this.x <= GAME_WIDTH - this.width && !collision.right) {
				this.x += this.speed
			} else if (this.direction == 'up' && this.y >= 0 && !collision.up) {
				this.y -= this.speed
				// Perspective simulation
				//this.speed -= .1
				//this.height -= .75
				this.width = this.height / 1.4
			} else if (this.direction == 'down' && this.y <= GAME_HEIGHT - this.height && !collision.down) {
				this.y += this.speed
				// Perspective simulation
				//this.speed += .1
				//this.height += .75
				this.width = this.height / 1.4
			}
		}

		this.draw()        
	}

	this.shoot = function() {
		this.bullets.push(
			new Bullet(
				this.ctx,
				this.x + this.width / 2,
				this.y + this.height / 2, 
				this.direction
			)
		)
	}
}).call(Player.prototype)

function Bullet(ctx, x, y, direction) {
	GameObject.apply(this, arguments)
	this.direction = direction
	this.lifetime = 1
	this.speed = 15
	this.radius = 20

	this.draw()
}
// Bullet methods
(function(){
	this.lifetimeDecrease = function() {
		this.lifetime -= 1 / 60
	}
	// Draw bullet
	this.draw = function() {
		this.ctx.beginPath()
		this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
		this.ctx.stroke()
		this.ctx.fillStyle = "#FF8800"
		this.ctx.fill()
		this.ctx.closePath()
	}
	// Change bullet attributes while moving
    this.move = function() {		
		if (this.direction == 'left') {
			this.x -= this.speed
		} else if (this.direction == 'right') {
			this.x += this.speed
		} else if (this.direction == 'up') {
			this.y -= this.speed
		} else if (this.direction == 'down') {
			this.y += this.speed
		}

		this.lifetimeDecrease()
		this.draw()        
	}
}).call(Bullet.prototype)