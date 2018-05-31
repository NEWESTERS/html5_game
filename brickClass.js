function Brick (ctx, x, y, width, height, id) {	
	GameObject.apply(this, arguments)
	// Brick fields
	this.type = 'Common Green Brick'
	this.id = id
	this.width = width ? width : 100
	this.height = height ? height : 100
	this.collision = 'none'
	 
	this.draw()
}
// Brick methods
(function() {
	// Draw brick
    this.draw = function() {
		this.ctx.beginPath()
		this.ctx.rect(
			this.x,
			this.y,
			this.width,
			this.height
		)
		this.ctx.fillStyle = "#009955"
		this.ctx.fill()
		this.ctx.closePath()
	}
}).call(Brick.prototype)