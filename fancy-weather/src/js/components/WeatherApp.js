/* eslint-disable no-alert */
import create from '../utils/create';
import * as constants from '../utils/constants';
import * as workers from '../utils/workers';

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
    this.widget = new Widget();
    this.mapContainer = new Map();

    this.timeNow = Date.now();

    this.timeOfDay = constants.TIME_OF_DAY.night;
    this.timeOfYear = constants.TIME_OF_YEAR.summer;
    this.currentPlace = '';

    this.longitude = 0;
    this.latitude = 0;
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
    const url = workers.urlForUnsplash(this.timeOfDay, this.timeOfYear);
    const data = await this.getDataFromAPI(url);

    document.body.style.background = workers.fadedBackgroundWithImg(data.urls.regular);
  }

  async handleClickRefreshBtn() {
    this.refreshBtn.classList.add(constants.CLASS_FOR_SPIN);
    await this.changeBodyBg();
    this.refreshBtn.classList.remove(constants.CLASS_FOR_SPIN);
  }

  async handleSuccessNavigatorQuery(response) {
    this.longitude = await response.coords.longitude;
    this.latitude = await response.coords.latitude;

    this.updateWidget();
    // await this.flyMapToCoords([this.longitude, this.latitude]);
    // this.setLongLat();
  }

  async updateWidget(placeName) {
    const data = await this.getDataFromAPI(
      workers.urlForWeatherAPI(
        `${this.latitude}${constants.DELIMITER_FOR_QUERY}${this.longitude}`,
      ),
    );
    const dateNow = workers.formatter('en-GB').format(new Date(`${data.location.localtime}`));

    this.widget.dayNow.innerHTML = dateNow;
    this.widget.location.innerHTML = `${placeName || data.location.name}, ${data.location.country}`;
    this.widget.tempNow.innerHTML = `${Math.round(data.current.temp_c)}°`;
    this.widget.weatherNow.innerHTML = data.current.condition.text;
    this.widget.tempFeeling.innerHTML = `Feels like: ${data.current.feelslike_c}°`;
    this.widget.windNow.innerHTML = `Wind: ${workers.convertWindUnits(data.current.wind_kph)} m/s`;
    this.widget.humidityNow.innerHTML = `Humidity: ${data.current.humidity}%`;
    this.widget.icon.src = data.current.condition.icon;
  }

  // eslint-disable-next-line class-methods-use-this
  handleErrorNavigatorQuery() {
    alert(constants.MESSAGE_ALLOW_GEO);
  }

  handleOnStartApp() {
    navigator
      .geolocation
      .getCurrentPosition(
        (res) => this.handleSuccessNavigatorQuery(res),
        this.handleErrorNavigatorQuery,
        constants.NAVIGATOR_OPTIONS,
      );
  }

  async getDataFromSearch(query) {
    const data = await this.getDataFromAPI(workers.urlToGetCoords(query));
    return data.features;
  }

  showMessageOnInvalidQuery() {
    this.searchForm.errorMessage.classList.add('form__error--shown');
    setTimeout(() => this.searchForm.errorMessage.classList.remove('form__error--shown'), constants.TIME_TO_SHOW_MESSAGE);
  }

  setLongLat() {
    const [longDegrees, longMinutes] = workers.splitNumberByPoint(this.longitude);
    const [latDegrees, latMinutes] = workers.splitNumberByPoint(this.latitude);

    this.mapContainer.lngContainer.innerHTML = `${longDegrees}° ${longMinutes}'`;
    this.mapContainer.latContainer.innerHTML = `${latDegrees}° ${latMinutes}'`;
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
      const dataFromSearch = await this.getDataFromSearch(query);

      if (dataFromSearch[0].center[0]) {
        [this.longitude, this.latitude] = dataFromSearch[0].center;
        const placeName = dataFromSearch[0].matching_text || dataFromSearch[0].text;

        this.updateWidget(placeName);
        await this.flyMapToCoords([this.longitude, this.latitude]);
        this.setLongLat();
        this.searchForm.form.reset();
      } else {
        this.showMessageOnInvalidQuery();
      }
    }
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
    const firstColumn = create('div', 'row__col-7', [this.widget.generateWidget(), this.renderForecast()]);
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
    this.mapContainer.init();
    this.handleOnStartApp();
    this.bindEventListeners();
  }
}
