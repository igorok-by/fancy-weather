import create from '../utils/create';

export default class Widget {
  constructor() {
    this.location = create('p', 'widget__location');
    this.tempNow = create('p', 'widget__tmp');
    this.weatherNow = create('p');
    this.tempFeeling = create('p');
    this.windNow = create('p');
    this.humidityNow = create('p');
    this.dayNow = create('span', 'widget__today');
    this.timeNow = create('span', 'widget__now');
    this.icon = create('img', 'widget__icon', null, null, ['alt', 'icon']);
    this.widget = create('div', 'widget');
  }

  generateHeader() {
    const header = create('div', 'row__col-12');
    const dateContainer = create('p', 'widget__date');

    dateContainer.append(this.dayNow, this.timeNow);
    header.append(this.location, dateContainer);
    return header;
  }

  generateTempContainer() {
    const tempContainer = create('div', 'row__col-md-12 row__col-7');
    tempContainer.append(this.tempNow);

    return tempContainer;
  }

  generateWeatherNow() {
    const weatherContainer = create('div', 'row__col-md-12 row__col-5');
    const weatherDescr = create('div', 'widget__descr');

    weatherDescr.append(this.weatherNow, this.tempFeeling, this.windNow, this.humidityNow);
    weatherContainer.append(this.icon, weatherDescr);

    return weatherContainer;
  }

  generateWidget() {
    const widgetContainer = create('div', 'row');

    widgetContainer.append(
      this.generateHeader(), this.generateTempContainer(), this.generateWeatherNow(),
    );
    this.widget.append(widgetContainer);

    return this.widget;
  }
}
