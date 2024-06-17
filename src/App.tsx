import { useState } from 'react';
import Map from './components/Map';
import TileLayer from './components/TileLayer';

import { LatLngBounds, LatLng } from 'leaflet';
import GeoJSON from '@components/GeoJSON';
import { sp } from './utils/geojson';
import Controls, { FullScreen, Zoom } from './components/Control';
import Polygon from './components/Polygon';
import Polyline from './components/Polyline';

import CircleMarker from './components/CircleMarker';
import Circle from './components/Circle';
import Rectangle from './components/Rectangle';
import SVGOverlay from './components/SVGOverlay';
import Marker from '@components/Marker';
import Icon from '@components/Icon';

import { ReactComponent as FS } from '@assets/fullscreen_on.svg';
import { ReactComponent as FO } from '@assets/fullscreen_off.svg';
import ImageOverlay from './components/ImageOverlay';
import VideoOverlay from './components/VideoOverlay';
import LayerGroup, { LayerGroupRef } from './components/LayerGroup';
import FeatureGroup from './components/FeatureGroup';
import Virtualization from './components/Virtualization';
import Popup from './components/Popup';
import Tooltip from '@components/Tooltip';
// import DivIcon from './components/DivIcon';

const defaultCenter: L.LatLngExpression = new LatLng(-23.5505, -46.6333);
const southWest = new LatLng(-89.98155760646617, -180);
const northEast = new LatLng(89.99346179538875, 180);
const maxBounds = new LatLngBounds(southWest, northEast);

const App = () => {
  const [hide, setHide] = useState<boolean>(false);

  const toggleHide = () => {
    setHide(state => !state);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map
        center={defaultCenter}
        zoom={4}
        maxBounds={maxBounds}
        maxZoom={20}
        keyboard
        attributionControl={false}
        // preferCanvas
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



        <Controls position="bottomleft">
          <div
            style={{
              width: 'fit-content',
              height: 'fit-content',
              backgroundColor: '#FFF',
              display: 'flex',
              flexDirection: 'column',
            }}>
            <Zoom />
            <FullScreen />

            <button
              style={{
                width: 'fit-content',
                height: 'fit-content',
              }}
              onClick={toggleHide}>
              H
            </button>
          </div>
        </Controls>

        <Virtualization />

        <Polygon
          positions={[]}
          weight={hide ? 2 : 5}
          color={hide ? 'blue' : 'red'}
        />

        <Circle
          position={[4, 5]}
          radius={hide ? 200000 : 150000}
          color={hide ? 'blue' : 'red'}
          interactive
        />

        <Rectangle
          position={
            hide
              ? [
                  [22, -22],
                  [40, -40],
                ]
              : [
                  [4, -4],
                  [0, 0],
                ]
          }
          color={hide ? 'blue' : 'red'}
        />

        <SVGOverlay
          bounds={[
            [22, -22],
            [40, -40],
          ]}>
          {hide ? (
            <FS width="100%" fill="green" height="100%" />
          ) : (
            <FO width="100%" fill="red" height="100%" />
          )}
        </SVGOverlay>

        <VideoOverlay
          src={
            hide
              ? 'https://www.youtube.com/watch?v=N_WgBU3S9W8'
              : 'https://www.mapbox.com/bites/00188/patricia_nasa.webm'
          }
          bounds={[
            [10, -10],
            [20, -20],
          ]}
        />

      




        <Polyline
          positions={[
            [40.712776, -74.005974],
            [34.052235, -118.243683],
            [51.507351, -0.127758],
            [35.689487, 139.691711],
            [-33.86882, 151.20929],
          ]}
          weight={hide ? 2 : 5}
          color={hide ? 'blue' : 'red'}
        />

        <GeoJSON
          data={sp}
          // onClick={() => setHide(state => !state)}
          style={{
            weight: 5,
            color: hide ? 'blue' : 'red',
          }}
        />

     

        <CircleMarker
          position={[0, 0]}
          color={hide ? 'blue' : 'red'}
          radius={hide ? 35 : 25}
        />
      </Map>
    </div>
  );
};

export default App;
