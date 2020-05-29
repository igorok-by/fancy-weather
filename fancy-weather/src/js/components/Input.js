import create from '../utils/create';

export default class Input {
  constructor() {
    this.input = create('input', 'form__input', null, null, ['type', 'text'], ['placeholder', 'Search city or ZIP']);

    this.submitBtn = create('button', ['button', 'button--search'], 'Search', null, ['type', 'submit']);

    this.microphoneBtn = create('button', ['button', 'button--microphone'], null, null, ['type', 'button']);

    this.microphoneBtn.insertAdjacentHTML('beforeend', '<svg><use xlink:href="./assets/img/sprite.svg#icon-microphone"></use></svg>');

    this.formSearch = create('form', 'form', [this.input, this.submitBtn, this.microphoneBtn], null, ['action', '/']);
  }
}
