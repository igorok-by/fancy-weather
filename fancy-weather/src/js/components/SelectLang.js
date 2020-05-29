import create from '../utils/create';

export default class SelectLang {
  constructor() {
    this.btnLangEN = create('button', 'button button--wide button--inside', 'en');

    this.btnLangRU = create('button', 'button button--wide button--left', 'ru');

    this.btnLangBE = create('button', 'button button--wide button--right', 'be');

    this.btnLangGroup = create('div', 'button-select', [this.btnLangRU, this.btnLangEN, this.btnLangBE]);
  }

  markBtnLang(evt) {
    const clickedBtn = evt.target;
    const langButtons = [...this.btnLangGroup.children];

    if (clickedBtn.classList.contains('button--wide')
      && !clickedBtn.classList.contains('button--active')) {
      langButtons.forEach((btn) => btn.classList.remove('button--active'));
      clickedBtn.classList.add('button--active');
    }
  }

  bindEventListeners() {
    this.btnLangGroup.addEventListener('click', (event) => this.markBtnLang(event));
  }

  init() {
    this.bindEventListeners();
  }
}
