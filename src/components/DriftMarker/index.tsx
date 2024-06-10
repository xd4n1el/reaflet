import { ReactNode, forwardRef, memo, useImperativeHandle } from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';
import { useMap } from '@hooks/useMap';

import { LatLng, LatLngExpression } from 'leaflet';
import DriftMarkerFactory, {
  DriftMarkerOptions,
  SlideToOptions,
} from './Factory';

import {
  compareObjects,
  excludeEvents,
  excludeProperties,
} from '@utils/functions';
import Element from '../Factory/Element';

interface CustomDriftMarkerProps {
  position: LatLngExpression;
  children?: ReactNode;
}

type ValidDriftMarkerOptions<T> = Omit<DriftMarkerOptions<T>, 'icon'>;
type ValidEventHandlers = Omit<
  EventHandlers,
  'onSpiderfied' | 'onUnspiderfied'
>;

export type DriftMarkerProps<T = any> = CustomDriftMarkerProps &
  ValidDriftMarkerOptions<T> &
  SlideToOptions &
  ValidEventHandlers;

export type DriftMarkerRef = DriftMarkerFactory;

const DriftMarker = memo(
  forwardRef<DriftMarkerRef, DriftMarkerProps>(
    ({ position, children, duration = 1000, keepAtCenter, ...rest }, ref) => {
      const map = useMap();

      const { element } = useElementFactory<
        DriftMarkerFactory,
        [LatLngExpression, DriftMarkerOptions]
      >({
        Factory: DriftMarkerFactory,
        options: [position, { ...rest, duration, keepAtCenter }],
      });
      useElementEvents({ element, props: rest });
      useElementLifeCycle({ element });
      useElementUpdate<DriftMarkerFactory, DriftMarkerProps>({
        element,
        props: { ...rest, duration, keepAtCenter, position },
        handlers: {
          position(prevValue, nextValue, instance) {
            const prevPosition: any = prevValue;
            const nextPosition: any = nextValue;

            if (Array.isArray(prevValue)) {
              prevPosition.lat = prevValue[0];
              prevPosition.lng = prevValue[1];
            }

            if (Array.isArray(nextValue)) {
              nextPosition.lat = nextValue[0];
              nextPosition.lng = nextValue[1];
            }

            const oldPosition = new LatLng(
              prevPosition?.lat,
              prevPosition?.lng,
            );
            const newPosition = new LatLng(
              nextPosition?.lat,
              nextPosition?.lng,
            );

            if (oldPosition.equals(newPosition)) return;

            instance?.slideTo(nextValue, { duration, keepAtCenter });

            // workaround, beacause when drift marker ends animation with keepAtCenter option, the map stucks

            if (keepAtCenter) {
              setTimeout(() => {
                map?.dragging?.enable();
              }, duration);
            }
          },
          data(prevValue, nextValue, instance) {
            const changes = compareObjects(prevValue, nextValue) || {};

            if (Object.keys(changes)?.length > 0) {
              instance?.setData(changes);
            }
          },
          draggable(prevValue, nextValue, instance) {
            const isDraggable = instance?.dragging?.enabled();

            if (isDraggable && !nextValue) {
              instance?.dragging?.disable();
            } else if (!isDraggable && nextValue) {
              instance?.dragging?.enable();
            }
          },
          allProps(prevValues, nextValues, instance) {
            let prevProps = excludeProperties<DriftMarkerProps>(prevValues, [
              'position',
              'data',
              'draggable',
              'position',
              'children',
            ]);

            let nextProps = excludeProperties<DriftMarkerProps>(nextValues, [
              'position',
              'data',
              'draggable',
              'position',
              'children',
            ]);

            prevProps = excludeEvents<DriftMarkerProps>(prevProps as any);
            nextProps = excludeEvents<DriftMarkerProps>(nextProps as any);

            const changes = compareObjects(prevProps, nextProps);

            if (Object.keys(changes)?.length > 0) {
              instance?.setOptions(changes as any);
            }
          },
        },
      });
      useImperativeHandle(ref, () => element!, [element]);

      return <Element container={element}>{children}</Element>;
    },
  ),
);

export default DriftMarker;
