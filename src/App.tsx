import { useEffect, useState } from 'react';
import Map from './components/Map';
import TileLayer from './components/TileLayer';
import { useRoutingMachine } from './hooks/useRoutingMachine';
import useGeoSearch, { createProvider } from './hooks/useGeoSearch';

import { LatLngBounds, LatLng } from 'leaflet';

import '@/styles/Reaflet.css';

const defaultCenter: L.LatLngExpression = new LatLng(-23.5505, -46.6333);
const southWest = new LatLng(-89.98155760646617, -180);
const northEast = new LatLng(89.99346179538875, 180);
const maxBounds = new LatLngBounds(southWest, northEast);

const App = () => {
  const [hide] = useState<boolean>(false);

  const router = useRoutingMachine({
    waypoints: [
      [40.748817, -73.985428],
      [40.73061, -73.935242],
    ],
  });

  useGeoSearch({
    provider: createProvider('open-streetmap'),
  });

  useEffect(() => {
    if (!router) return;

    const nycLocations = [
      [40.748817, -73.985428], // Empire State Building
      [40.758896, -73.98513], // Times Square
      [40.785091, -73.968285], // Central Park
      [40.689247, -74.044502], // Statue of Liberty
      [40.706086, -73.996864], // Brooklyn Bridge
      [40.707491, -74.011276], // Wall Street
      [40.752726, -73.977229], // Grand Central Terminal
      [40.751652, -73.975311], // Chrysler Building
      [40.75874, -73.978674], // Rockefeller Center
      [40.779437, -73.963244], // The Metropolitan Museum of Art
    ];

    const newest = nycLocations.map(([a, b]) => {
      return new LatLng(a, b);
    });

    const current = router?.getWaypoints().map(waypoint => waypoint?.latLng);

    router?.setWaypoints([...current, ...newest]);
  }, [router]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map
        center={defaultCenter}
        zoom={4}
        maxBounds={maxBounds}
        maxZoom={20}
        keyboard
        attributionControl={false}
        doubleClickZoom={false}>
        <TileLayer
          url={
            hide
              ? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
              : 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}'
          }
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={22}
          minZoom={4}
          noWrap
        />
      </Map>
    </div>
  );
};

export default App;
