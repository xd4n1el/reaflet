import Map from './components/Map';
import TileLayer from './components/TileLayer';

import L from 'leaflet';

const defaultCenter: L.LatLngExpression = new L.LatLng(-23.5505, -46.6333);
const southWest = L.latLng(-89.98155760646617, -180);
const northEast = L.latLng(89.99346179538875, 180);
const maxBounds = L.latLngBounds(southWest, northEast);

const App = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map center={defaultCenter} zoom={10} maxBounds={maxBounds}>
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={22}
        />
      </Map>
    </div>
  );
};

export default App;
