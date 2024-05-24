import {
  HTMLAttributes,
  forwardRef,
  useCallback,
  useDebugValue,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useMapStore } from '@store/map';

import { Map as MapFactory, MapOptions, LatLngExpression } from 'leaflet';

import 'leaflet/dist/leaflet.css';

export interface MapProps extends MapOptions {
  children?: React.ReactNode;
  containerAttributes?: HTMLAttributes<HTMLDivElement>;
  center: LatLngExpression;
  zoom: number;
}

export interface MapRef extends HTMLDivElement {}

const Map = forwardRef<MapRef, MapProps>(
  ({ children, containerAttributes = {}, ...rest }, ref) => {
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(
      null,
    );

    const { createMap, destroyMap, map } = useMapStore(state => state);

    // wip
    const updateMapOptions = useCallback(() => {
      // map?.setView(center, zoom);
    }, [rest, map]);

    useEffect(() => {
      if (!containerRef) return;

      if (map) return;

      if (!rest?.center) {
        throw new Error('A center must be provided to map render properly.');
      }

      const mapElement = new MapFactory(containerRef, { ...rest });

      createMap(mapElement);

      return () => {
        destroyMap();
      };
    }, [containerRef, createMap, destroyMap]);

    useEffect(() => {
      if (!map) return;

      updateMapOptions();
    }, [rest, map, updateMapOptions]);

    useImperativeHandle(ref, () => containerRef!, [containerRef]);
    useDebugValue('@xd4n1el/react-leaflet');

    return (
      <div
        {...containerAttributes}
        id="leaflet-container"
        style={{ height: '100%', ...containerAttributes?.style }}
        ref={setContainerRef}>
        {children}
      </div>
    );
  },
);

export default Map;
