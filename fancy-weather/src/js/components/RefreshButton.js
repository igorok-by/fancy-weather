import create from '../utils/create';

export default class RefreshButton {
  constructor() {
    this.refreshBtn = create('button', ['button', 'button--refresh']);

    this.refreshBtn.insertAdjacentHTML('beforeend', '<svg class="button__spinner"><use xlink:href="./assets/img/sprite.svg#icon-spinner"></use></svg>');
  }
}
