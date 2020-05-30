import create from '../utils/create';
import * as constants from '../utils/constants';

export default class Input {
  constructor() {
    this.input = create('input', 'form__input', null, null, ['type', 'text'], ['placeholder', 'Search city or ZIP']);

    this.submitBtn = create('button', 'button button--search', 'Search', null, ['type', 'submit']);

    this.microphoneBtn = create('button', 'button button--microphone', null, null, ['type', 'button']);

    this.microphoneBtn.insertAdjacentHTML('beforeend', '<svg><use xlink:href="./assets/img/sprite.svg#icon-microphone"></use></svg>');

    this.errorMessage = create('p', 'form__error', constants.NOT_VALID);

    this.form = create('form', 'form', [this.input, this.submitBtn, this.microphoneBtn, this.errorMessage], null, ['action', '/']);
  }

  getValue() {
    const value = this.input.value.replace(/\s+/gi, constants.DELIMITER_FOR_QUERY).toLowerCase();

    return value;
  }
}
