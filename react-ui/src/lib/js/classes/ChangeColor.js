class ChangeColor {

  static #_correct = 0
  static #_incorrect = 1
  static #_normal = 2
  #name = ''

  static get incorrect () {
    return this.#_incorrect
  }

  static get normal () {
    return this.#_normal
  }

  static get correct () {
    return this.#_correct
  }

  constructor (name) {
    this.#name = name
  }

  toggleColor (i) {
    const name = ' ' + this.#name

    switch (i) {
      case ChangeColor.correct:
        return name + '-correct'
      case ChangeColor.incorrect:
        return name + '-incorrect'
      case ChangeColor.normal:
        return name + '-normal'
      default:
        break
    }

    throw new Error('Je n\'ai pas trouvé de couleur enfoiré')
  }
}

export default ChangeColor
