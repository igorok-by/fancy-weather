import mapboxgl from 'mapbox-gl';
import create from '../utils/create';
import * as constants from '../utils/constants';

export default class Map {
  constructor() {
    this.map = {};
    this.lngContainer = create('span', null, null, null, ['id', 'longitude']);
    this.latContainer = create('span', null, null, null, ['id', 'latitude']);
    this.mapContainer = create('div', 'map__container', null, null, ['id', 'map']);
    this.mapApiKey = constants.MAPGL_ARI_KEY;
  }

  generateMap() {
    const lngWrap = create('p', 'map__coords', ['Longitude: ', this.lngContainer]);
    const latWrap = create('p', 'map__coords', ['Latitude: ',
      this.latContainer,
    ]);
    const map = create('div', 'map', [this.mapContainer, lngWrap, latWrap]);

    return map;
  }

  init() {
    mapboxgl.accessToken = this.mapApiKey;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 13,
      attributionControl: false,
    });
  }
}
