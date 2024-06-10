import {
  ReactNode,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
} from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import { Layer } from 'leaflet';
import { GeoJsonObject } from 'geojson';
import Element from '@components/Factory/Element';
import GeoJSONFactory, { GeoJSONOptions } from './Factory';

interface BaseGeoJSONProps {
  children?: ReactNode;
  data: GeoJsonObject;
}

interface GeoJSONEvents extends EventHandlers {
  onEachLayer?: (layer: Layer) => void;
}

export type GeoJSONProps = BaseGeoJSONProps &
  Omit<GeoJSONOptions, 'eachLayer'> &
  GeoJSONEvents;

export type GeoJSONRef = GeoJSONFactory;

const GeoJSON = memo(
  forwardRef<GeoJSONRef, GeoJSONProps>(
    ({ children, data, onEachLayer, ...rest }, ref) => {
      const { element } = useElementFactory<
        GeoJSONFactory,
        [GeoJsonObject, GeoJSONOptions]
      >({
        Factory: GeoJSONFactory,
        options: [data, rest],
      });
      useElementEvents({ element, props: rest });
      useElementUpdate<
        GeoJSONFactory,
        BaseGeoJSONProps & Omit<GeoJSONOptions, 'eachLayer'>
      >({
        element,
        props: { ...rest, data },
        handlers: {
          data(prevValue, nextValue, instance) {
            instance?.clearLayers(); // when data changes, old layers needs be removed and new needs be draw

            // workaround to leaflet apply the correct update state
            setTimeout(() => {
              instance?.addData(nextValue);
            }, 0);
          },
          style(prevValue, nextValue, instance) {
            instance?.clearLayers(); // if layers not be removed, leaflet will be multiply them by 2x every time this prop changes

            // workaround to leaflet apply the correct update state
            setTimeout(() => {
              instance?.setStyle({ ...nextValue });
            }, 0);
          },
          allProps(prevValues, nextValues, instance) {
            instance?.setOptions(nextValues);
          },
        },
      });
      useElementLifeCycle({ element });
      useImperativeHandle(ref, () => element!, [element]);

      useEffect(() => {
        if (!element || !onEachLayer) return;

        element?.eachLayer(onEachLayer);
      }, [element, onEachLayer]);

      return <Element container={element}>{children}</Element>;
    },
  ),
);

export default GeoJSON;
