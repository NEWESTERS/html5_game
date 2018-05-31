// Class for modal window
function Modal(id) {
	const element = document.getElementById(id)
	const header = document.querySelector('#' + id + '>.modal-header')
	const info = document.querySelector('#' + id + '>.modal-info')
	element.opened = false

	// Show given object in modal window
	this.show = function(object) {
		if (!element.opened) {
			this.update(`ID: ${object.id}`, object.type)
		}

		this.toggle()
	}

	// Open/close modal window
	this.toggle = function() {
		if (element.opened) {
			element.classList.remove('open')
		} else {
			element.classList.add('open')
		}
		element.opened = !element.opened
	}

	// Update content of modal window
	this.update = function(header_text, info_text) {
		header.innerHTML = header_text
		info.innerHTML = info_text
	}
}