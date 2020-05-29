import create from '../utils/create';

export default class SelectUnit {
  constructor() {
    this.btnFahrenheit = create('button', ['button', 'button--wide', 'button--left'], '°F');

    this.btnCelsius = create('button', ['button', 'button--wide', 'button--right'], '°C');

    this.btnLangGroup = create('div', 'button-select', [this.btnFahrenheit, this.btnCelsius]);
  }

  markBtnLang(evt) {
    const clickedBtn = evt.target;
    const buttons = [...this.btnLangGroup.children];

    if (clickedBtn.classList.contains('button--wide')
      && !clickedBtn.classList.contains('button--active')) {
      buttons.forEach((btn) => btn.classList.remove('button--active'));
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
