import { useEffect, useRef, useState } from 'react';
import Map from './components/Map';
import TileLayer from './components/TileLayer';

import { LatLngBounds, LatLng } from 'leaflet';
import GeoJSON from '@components/GeoJSON';
import { sp } from './utils/geojson';
import Controls, { FullScreen, Zoom } from './components/Control';

// import Markers from './Markers';
// import Popup from '@/components/Popup';
// import Marker from '@components/Marker';
// import Tooltip from '@/components/Tooltip';
// import DriftMarker from '@components/DriftMarker';

// import IMG from '@/images/marker.png';
// import Icon from '@components/Icon';
// import DivIcon from '@components/DivIcon';

// import ClusterGroup from './components/ClusterGroup';
// import CanvasGroup from './components/CanvasGroup';
// import Virtualization from './components/Virtualization';
// import MarkersEl from './MarkersEl';

const defaultCenter: L.LatLngExpression = new LatLng(-23.5505, -46.6333);
const southWest = new LatLng(-89.98155760646617, -180);
const northEast = new LatLng(89.99346179538875, 180);
const maxBounds = new LatLngBounds(southWest, northEast);

const App = () => {
  // const [position, setPosition] = useState<LatLngExpression>([0, 0]);
  // const [data, setData] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hide, setHide] = useState<boolean>(false);

  // const ref = useRef<MarkerRef>(null);
  const perf = useRef<any>();

  useEffect(() => {
    perf.current = performance.now();
  }, []);

  // const toggleHide = () => {
  //   setHide(state => !state);
  // };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map
        center={defaultCenter}
        zoom={4}
        maxBounds={maxBounds}
        maxZoom={20}
        keyboard
        // preferCanvas
        doubleClickZoom={false}>
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={22}
          minZoom={4}
          noWrap
        />

        {!hide && (
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

              {/* <button
                style={{
                  width: 'fit-content',
                  height: 'fit-content',
                }}
                onClick={toggleHide}>
                Desmanchar
              </button> */}
            </div>
          </Controls>
        )}

        <GeoJSON
          data={sp}
          // onClick={() => setHide(state => !state)}
          style={{
            weight: 5,
            color: hide ? 'blue' : 'red',
          }}
        />

        {/* <ClusterGroup
          singleMarkerMode={false}
          zoomToBoundsOnClick={false}
          removeOutsideVisibleBounds={false}>
          <Markers size={25000} />
        </ClusterGroup> */}

        {/* {!hide && (
          <ClusterGroup
            singleMarkerMode={false}
            zoomToBoundsOnClick={false}
            removeOutsideVisibleBounds={false}>
            <Virtualization>
              <MarkersEl size={50000} />
            </Virtualization>
          </ClusterGroup>
        )} */}

        {/* <CanvasGroup>
          <Markers size={100} />
        </CanvasGroup> */}
      </Map>
    </div>
  );
};

export default App;
