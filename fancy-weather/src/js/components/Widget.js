import create from '../utils/create';

export default class Widget {
  constructor({
    location, dayNow, timeNow, tempNow, weatherNow, tempFeeling, windNow, humidityNow,
  }) {
    this.location = location;
    this.dayNow = dayNow;
    this.timeNow = timeNow;
    this.tempNow = tempNow;
    this.weatherNow = weatherNow;
    this.tempFeeling = tempFeeling;
    this.windNow = windNow;
    this.humidityNow = humidityNow;
    this.widget = create('div', 'widget');
  }

  generateWidget() {
    const template = `<div class="row">
      <div class="row__col-12">
        <p class="widget__location">${this.location}</p>
        <p class="widget__date"><span class="widget__today">${this.dayNow}</span> &nbsp; <span class="widget__time">${this.timeNow}</span></p>
      </div>
      <div class="row__col-7">
        <p class="widget__tmp"><span>${this.tempNow}</span><span class="small">°</span></p>
      </div>
      <div class="row__col-5">
        <svg class="widget__icon"><use xlink:href="./assets/img/sprite.svg#${this.weatherNow}"></use></svg>
        <div class="widget__descr">
          <p>${this.weatherNow}</p>
          <p>Feels like: <span>${this.tempFeeling}</span>°</p>
          <p>Wind: <span>${this.windNow}</span>&nbsp;<span class="lo-case">m/s</span></p>
          <p>Humidity: <span>${this.humidityNow}</span>%</p>
        </div>
      </div>
    </div>`;

    this.widget.insertAdjacentHTML('beforeend', template);
    return this.widget;
  }
}
