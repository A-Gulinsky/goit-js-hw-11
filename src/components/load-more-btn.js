export default class LoadMoreBtn {
  constructor({ selector, hidden = false}) {
    this.refs = this.getRefs(selector)

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {}
    refs.button = document.querySelector(selector);
    refs.label = refs.button.querySelector(`.label`);
    refs.loading = document.querySelector(`#loading`);
    refs.ifEnd = document.querySelector(`.info-text`)
    return refs
  }

  enable() {
    this.refs.button.disabled = false;
    this.refs.label.textContent = `Load more...`;
    this.refs.ifEnd.classList.add(`info-text-hidden`)
    this.refs.loading.classList.add(`loading-hidden`)
  }

  disabled() {
    this.refs.button.disabled = true;
    this.refs.label.textContent = ``
    this.refs.loading.classList.remove(`loading-hidden`)
    this.refs.button.classList.add(`is-hidden`)
  }

  show() {
    this.refs.button.classList.remove(`is-hidden`)
  }

  hide() {
    this.refs.button.classList.add(`is-hidden`)
  }

  ifLastEl() {
    this.refs.button.classList.add(`is-hidden`)
    this.refs.loading.classList.add(`loading-hidden`)
    this.refs.ifEnd.classList.remove(`info-text-hidden`)
  }

  loadingHide() {
    this.refs.loading.classList.add(`loading-hidden`)
  }
}