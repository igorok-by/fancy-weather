import create from '../utils/create';

import ForecastItem from './ForecastItem';
import Input from './Input';
import RefreshButton from './RefreshButton';
import SelectLang from './SelectLang';
import SelectUnit from './SelectUnit';
import Widget from './Widget';

export default class WeatherApp {
  constructor() {
    this.body = document.body;
    this.header = create('header');
    this.main = create('main');
    this.forecast = create('div', 'forecast');

    this.refreshBtn = new RefreshButton();
    this.selectLang = new SelectLang();
    this.selectUnit = new SelectUnit();
    this.inputForm = new Input();

    this.widget = '';
  }

  renderHeader() {
    const btnGroup = create('div', 'button-group', [this.refreshBtn.refreshBtn, this.selectLang.btnLangGroup, this.selectUnit.btnLangGroup]);
    const firstPart = create('div', 'row__col-6', btnGroup);
    const secondPart = create('div', 'row__col-6', this.inputForm.formSearch);
    const row = create('div', 'row', [firstPart, secondPart]);
    const container = create('div', 'container', row);

    this.selectLang.init();
    this.selectUnit.init();

    this.header.append(container);
    return this.header;
  }

  renderWidget() {
    const widgetTemplate = new Widget({
      location: 'Minsk, Belarus',
      dayNow: 'Mon 28 October',
      timeNow: '17:23:50',
      tempNow: 10,
      weatherNow: 'icon-cloud',
      tempFeeling: 7,
      windNow: 2,
      humidityNow: 83,
    });


    this.widget = widgetTemplate.generateWidget();
    return this.widget;
  }

  renderForecast() {
    const first = new ForecastItem({
      day: 'Tuesday',
      temperature: '7',
      weather: 'icon-cloud-sun',
    });
    const second = new ForecastItem({
      day: 'Wednesday',
      temperature: '11',
      weather: 'icon-cloud',
    });
    const third = new ForecastItem({
      day: 'Thursday',
      temperature: '7',
      weather: 'icon-cloud-sun',
    });
    const row = create('div', 'row', [first.generateItem(), second.generateItem(), third.generateItem()]);

    this.forecast.prepend(row);
    return this.forecast;
  }

  renderMain() {
    const firstColumn = create('div', 'row__col-7', [this.renderWidget(), this.renderForecast()]);
    const secondColumn = create('div', 'row__col-5');
    const row = create('div', 'row', [firstColumn, secondColumn]);
    const container = create('div', 'container', row);

    this.main.prepend(container);
    return this.main;
  }

  renderApp() {
    this.header = this.renderHeader();
    this.main = this.renderMain();

    this.body.prepend(this.header, this.main);
  }

  init() {
    this.renderApp();
  }
}
