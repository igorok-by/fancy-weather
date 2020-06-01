
const UNSPLASH_API_KEY = 'UFgX_Xh8GsfhIspBPYPiu7MGs7X6MeZ1rCEkfwuiRsU';

export const MAPGL_ARI_KEY = 'pk.eyJ1IjoiaWdvcmtvLWJ5IiwiYSI6ImNrYXRlZ2xjZjBzaWMydW1zZWtka2k3cmUifQ.oo4GZqHkQn_dBXjgNNZ6Gw';

export const TIME_OF_DAY = {
  morning: 'morning',
  afternoon: 'afternoon',
  evening: 'evening',
  night: 'night',
};

export const TIME_OF_YEAR = {
  spring: 'spring',
  summer: 'summer',
  autumn: 'autumn',
  winter: 'winter',
};

export const NAVIGATOR_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export const TIME_TO_SHOW_MESSAGE = 3000;
export const CLASS_FOR_SPIN = 'button--do-spin';
export const DELIMITER_FOR_QUERY = '%20';
export const DEFAULT_PLACE = 'minsk';
export const NOT_VALID = 'The query has to be a name of city or ZIP';
export const MESSAGE_ALLOW_GEO = 'Please allow access to your geolocation for the application to work correctly';

export const urlForUnsplash = (queryMain, queryMinor) => `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=${queryMain},${queryMinor}&client_id=${UNSPLASH_API_KEY}`;

export const urlToGetCoords = (query) => `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?&access_token=${MAPGL_ARI_KEY}`;

export const fadedBackgroundWithImg = (urlToImg) => `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)) center center / cover, url("${urlToImg}") center / cover no-repeat`;

export const splitNumberByPoint = (number) => {
  const arrFromNumb = `${number.toFixed(2)}`.split('.');

  return [arrFromNumb[0], arrFromNumb[1]];
};
