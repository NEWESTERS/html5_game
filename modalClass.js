// Class for modal window
function Modal(id) {
	const element = document.getElementById(id)
	const header = document.querySelector('#' + id + '>.modal-header')
	element.opened = false

	this.show = function(object) {
		if (!element.opened) {
			this.update(object.id)
		}
		
		this.toggle()
	}

	this.toggle = function() {
		if (element.opened) {
			element.classList.remove('open')
		} else {
			element.classList.add('open')
		}
		element.opened = !element.opened
	}

	this.update = function(text) {
		header.innerHTML = text
	}
}