import * as constants from './constants';

export const urlForUnsplash = (queryMain, queryMinor) => `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=${queryMain},${queryMinor}&client_id=${constants.UNSPLASH_API_KEY}`;

export const urlToGetCoords = (query) => `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?&access_token=${constants.MAPGL_ARI_KEY}`;

export const urlForWeatherAPI = (coords) => `https://api.weatherapi.com/v1/forecast.json?key=${constants.WEATHER_API_KEY}&q=${coords}&days=4`;

export const fadedBackgroundWithImg = (urlToImg) => `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)) center center / cover, url("${urlToImg}") center / cover no-repeat`;

export const splitNumberByPoint = (number) => {
  const arrFromNumb = `${number.toFixed(2)}`.split('.');

  return [arrFromNumb[0], arrFromNumb[1]];
};

export const formatterNow = (lang) => new Intl.DateTimeFormat(lang, {
  weekday: 'short',
  month: 'long',
  day: 'numeric',
});

export const formatterDay = (lang) => new Intl.DateTimeFormat(lang, {
  weekday: 'long',
});

export const convertWindUnits = (kph) => Math.round((kph * 5) / 18);

export const checkTime = (numb) => {
  const decimal = (numb < 10) ? `0${numb}` : numb;
  return decimal;
};

export const differenceInTime = (differentDate) => {
  const difference = Math.ceil((Date.parse(new Date(differentDate)) - Date.parse(new Date()))
  / constants.MILLISECONDS_IN_HOUR);

  return difference;
};
