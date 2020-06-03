import create from '../utils/create';

export default class ForecastItem {
  constructor() {
    this.day = create('p', 'forecast__day');
    this.temperature = create('span', 'forecast__tmp');
    this.icon = create('img', 'forecast__icon', null, null, ['alt', 'icon']);
    this.forecastItem = create('div', 'row__col-sm-12 row__col-4');
  }

  generateItem() {
    const itemBody = create('div', 'forecast__body');

    itemBody.append(this.temperature, this.icon);
    this.forecastItem.append(this.day, itemBody);

    return this.forecastItem;
  }
}
