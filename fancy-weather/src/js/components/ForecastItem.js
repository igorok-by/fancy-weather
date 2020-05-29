import create from '../utils/create';

export default class ForecastItem {
  constructor({ day, temperature, weather }) {
    this.day = day;
    this.temperature = temperature;
    this.weather = weather;
    this.forecastItem = create('div', 'forecast__item');
  }

  generateItem() {
    const template = `<div class="row__col-4">
      <div class="forecast__item">
        <p class="forecast__day">${this.day}</p>
        <div class="forecast__body">
          <span class="forecast__tmp">${this.temperature}°</span>
          <svg class="forecast__icon"><use xlink:href="./assets/img/sprite.svg#${this.weather}"></use></svg>
        </div>
      </div>
    </div>`;

    this.forecastItem.insertAdjacentHTML('beforeend', template);
    return this.forecastItem;
  }
}
