import { LatLng, LatLngBounds } from 'leaflet';

const northEast = new LatLng(89.99346179538875, 180);
const southWest = new LatLng(-89.98155760646617, -180);

export const WorldBounds = new LatLngBounds(southWest, northEast);
