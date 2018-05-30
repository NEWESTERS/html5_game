function Player(ctx, x, y) {
	GameObject.apply(this, arguments)
	// Player fields
	this.speed = 7
	this._frameNumber = 0
	this._image = new Image()
	this._image.src = 'player.png'
	this._bullets = []

	this.height = 50
	this.width = this.height / 1.4
	this.direction = 'down'
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
		for (let i = this._bullets.length - 1; i >= 0; i--) {
        	if (this._bullets[i].lifetime > 0) {
        		this._bullets[i].move()
        	} else {
        		this._bullets.splice(i, 1)
        	}
        }

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

		this._draw()        
	}

	this.shoot = function() {
		this._bullets.push(
			new Bullet(
				this._ctx,
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
	this.radius = 10

	this._draw()
}
// Bullet methods
(function(){
	this._lifetimeDecrease = function() {
		this.lifetime -= 1 / 60
	}
	// Draw bullet
	this._draw = function() {
		this._ctx.beginPath()
		this._ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
		this._ctx.stroke()
		this._ctx.fillStyle = "#FF8800"
		this._ctx.fill()
		this._ctx.closePath()
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

		this._lifetimeDecrease()
		this._draw()        
	}
}).call(Bullet.prototype)