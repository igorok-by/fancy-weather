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
    this.firstForecast = new ForecastItem();
    this.secondForecast = new ForecastItem();
    this.thirdForecast = new ForecastItem();

    this.timeNow = Date.now();

    this.timeOfDay = constants.TIME_OF_DAY.night;
    this.timeOfYear = constants.TIME_OF_YEAR.summer;
    this.currentPlace = '';

    this.longitude = 0;
    this.latitude = 0;
  }

  // eslint-disable-next-line consistent-return
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
    const data = await this.getDataFromWeather();
    const dateNow = workers.formatterNow('en-GB').format(new Date(`${data.location.localtime}`));

    this.widget.dayNow.innerHTML = dateNow;
    this.widget.location.innerHTML = `${placeName || data.location.name}, ${data.location.country}`;
    this.widget.tempNow.innerHTML = `${Math.round(data.current.temp_c)}°`;
    this.widget.weatherNow.innerHTML = data.current.condition.text;
    this.widget.tempFeeling.innerHTML = `Feels like: ${data.current.feelslike_c}°`;
    this.widget.windNow.innerHTML = `Wind: ${workers.convertWindUnits(data.current.wind_kph)} m/s`;
    this.widget.humidityNow.innerHTML = `Humidity: ${data.current.humidity}%`;
    this.widget.icon.src = data.current.condition.icon;

    this.updateForecast(data);
  }

  updateForecast(data) {
    const forecast = data.forecast.forecastday;

    this.updateForecastItem(this.firstForecast, forecast[0]);
    this.updateForecastItem(this.secondForecast, forecast[1]);
    this.updateForecastItem(this.thirdForecast, forecast[2]);
  }

  updateForecastItem(item, dataForItem) {
    let whatDay;

    if (item === this.firstForecast) {
      whatDay = constants.TOMORROW;
    } else if (item === this.secondForecast) {
      whatDay = constants.AFTER_TOMORROW;
    } else {
      whatDay = constants.AFTER_AFTER_TOMORROW;
    }

    const currentItem = item;
    const dayName = workers.formatterDay('en-GB').format(new Date().setDate(whatDay));

    currentItem.day.innerHTML = dayName;

    currentItem.temperature.innerHTML = `${Math.round(dataForItem.day.avgtemp_c)}°`;
    currentItem.icon.src = dataForItem.day.condition.icon;
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

  async getDataFromMap(query) {
    const data = await this.getDataFromAPI(workers.urlToGetCoords(query));

    if (data.features[0]) {
      return data.features;
    }
    return data;
  }

  async getDataFromWeather() {
    const data = await this.getDataFromAPI(
      workers.urlForWeatherAPI(
        `${this.latitude}${constants.DELIMITER_FOR_QUERY}${this.longitude}`,
      ),
    );
    return data;
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
      const dataFromMap = await this.getDataFromMap(query);

      if (dataFromMap[0]) {
        [this.longitude, this.latitude] = dataFromMap[0].center;

        if (dataFromMap[0].text && !Number.isNaN(+dataFromMap[0].text)) {
          this.updateWidget();
        } else {
          const placeName = dataFromMap[0].matching_text || dataFromMap[0].text;
          this.updateWidget(placeName);
        }

        // this.changeBodyBg();
        // await this.flyMapToCoords([this.longitude, this.latitude]);
        // this.setLongLat();
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
    const row = create('div', 'row', [this.firstForecast.generateItem(), this.secondForecast.generateItem(), this.thirdForecast.generateItem()]);

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
