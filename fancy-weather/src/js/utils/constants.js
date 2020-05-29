
const UNSPLASH_API_KEY = 'UFgX_Xh8GsfhIspBPYPiu7MGs7X6MeZ1rCEkfwuiRsU';

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

export const CLASS_FOR_SPIN = 'button--do-spin';

export const urlForUnsplash = (queryMain, queryMinor) => `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=${queryMain}+${queryMinor}&client_id=${UNSPLASH_API_KEY}`;

export const fadedBackgroundWithImg = (urlToImg) => `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)) center center / cover, url("${urlToImg}") center / cover no-repeat`;
