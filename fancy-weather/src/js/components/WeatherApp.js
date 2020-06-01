import create from '../utils/create';
import * as constants from '../utils/constants';

import ForecastItem from './ForecastItem';
import Input from './Input';
import RefreshButton from './RefreshButton';
import SelectLang from './SelectLang';
import SelectUnit from './SelectUnit';
import Widget from './Widget';
import Map from './Map';

export default class WeatherApp {
  constructor() {
    this.body = document.body;
    this.header = create('header');
    this.main = create('main');
    this.forecast = create('div', 'forecast');

    this.refreshBtn = new RefreshButton().refreshBtn;
    this.selectLang = new SelectLang();
    this.selectUnit = new SelectUnit();
    this.searchForm = new Input();
    this.mapContainer = new Map();

    this.timeOfDay = constants.TIME_OF_DAY.night;
    this.timeOfYear = constants.TIME_OF_YEAR.summer;
    this.currentPlace = constants.DEFAULT_PLACE;

    this.currentCoords = [];
    this.longitude = 0;
    this.latitude = 0;
    this.widget = '';
  }

  async getDataFromAPI(url) {
    this.url = url;

    try {
      const res = await fetch(this.url);
      const data = await res.json();

      return data;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  async changeBodyBg() {
    const url = constants.urlForUnsplash(this.timeOfDay, this.timeOfYear);
    const data = await this.getDataFromAPI(url);

    document.body.style.background = constants.fadedBackgroundWithImg(data.urls.regular);
  }

  async handleClickRefreshBtn() {
    this.refreshBtn.classList.add(constants.CLASS_FOR_SPIN);
    await this.changeBodyBg();
    this.refreshBtn.classList.remove(constants.CLASS_FOR_SPIN);
  }

  renderHeader() {
    const btnGroup = create('div', 'button-group', [this.refreshBtn, this.selectLang.btnLangGroup, this.selectUnit.btnLangGroup]);
    const firstPart = create('div', 'row__col-6', btnGroup);
    const secondPart = create('div', 'row__col-6', this.searchForm.form);
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

  async getCoordsFromQuery(query) {
    const data = await this.getDataFromAPI(constants.urlToGetCoords(query));

    if (data.features[0]) {
      return data.features[0].center;
    }
    return data.features;
  }

  showMessageOnInvalidQuery() {
    this.searchForm.errorMessage.classList.add('form__error--shown');
    setTimeout(() => this.searchForm.errorMessage.classList.remove('form__error--shown'), 3000);
  }

  setLongLat() {
    this.mapContainer.lngContainer.innerHTML = `${this.longitude}`;
    this.mapContainer.latContainer.innerHTML = `${this.latitude}`;
  }

  async flyMapToCoords(coords) {
    await this.mapContainer.map.flyTo({
      center: coords,
      speed: 2,
      curve: 1,
      essential: true,
    });
  }

  async handleSubmitInput(e) {
    e.preventDefault();

    if (this.searchForm.input.value && this.searchForm.input.value !== this.currentPlace) {
      const query = this.searchForm.getValue();
      const coords = await this.getCoordsFromQuery(query);

      if (coords[0]) {
        await this.flyMapToCoords(coords);
        [this.longitude, this.latitude] = coords;
        this.setLongLat();

        this.searchForm.form.reset();
      } else {
        this.showMessageOnInvalidQuery();
      }
    }
  }

  renderMain() {
    const firstColumn = create('div', 'row__col-7', [this.renderWidget(), this.renderForecast()]);
    const secondColumn = create('div', 'row__col-5', this.mapContainer.generateMap());
    const row = create('div', 'row', [firstColumn, secondColumn]);
    const container = create('div', 'container', row);

    this.main.prepend(container);
    return this.main;
  }

  renderApp() {
    this.header = this.renderHeader();
    this.main = this.renderMain();

    this.body.prepend(this.header, this.main);
    // this.changeBodyBg();
  }

  bindEventListeners() {
    this.refreshBtn.addEventListener('click', async () => this.handleClickRefreshBtn());
    this.searchForm.form.addEventListener('submit', async (event) => this.handleSubmitInput(event));
  }

  init() {
    this.renderApp();
    this.bindEventListeners();
    this.mapContainer.init();
  }
}
