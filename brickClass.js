function Brick (ctx, x, y, width, height, id) {	
	GameObject.apply(this, arguments)
	// Brick fields
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
}).call(Brick.prototype)