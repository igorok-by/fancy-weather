import create from '../utils/create';

export default class ForecastItem {
  constructor() {
    this.day = create('p', 'forecast__day');
    this.temperature = create('span', 'forecast__tmp');
    this.icon = new Image();
    this.forecastItem = create('div', 'row__col-4');
  }

  generateItem() {
    const item = create('div', 'row__col-4');
    const itemBody = create('div', 'forecast__body');

    itemBody.append(this.temperature, this.icon);
    item.append(this.day, itemBody);

    return item;
  }
}
