class ChangeColor {
	static get incorrect() {
		return this.#_incorrect;
	}

	static get normal() {
		return this.#_normal;
	}
	static get correct() {
		return this.#_correct;
	}

	static #_correct = 0
	static #_incorrect = 1
	static #_normal = 2

	#name = ""
	#elem = null

	constructor(name, elem) {
		this.#name = name;
		this.#elem = elem;
	}

	#toggleColor = (_elem,i) => {
		_elem.classList.toggle(this.#name+"-correct",i === ChangeColor._correct)
		_elem.classList.toggle(this.#name+"-incorrect",i === ChangeColor._incorrect)
		_elem.classList.toggle(this.#name+"-normal",i === ChangeColor._normal)
	}

	change(i) {
		if(this.#elem.isPrototypeOf(HTMLCollection))
			this.#elem.forEach((_elem) => this.#toggleColor(_elem,i))
		else if(this.#elem.isPrototypeOf(HTMLElement))
			this.#toggleColor(this.#elem,i)
	}

}

export default ChangeColor