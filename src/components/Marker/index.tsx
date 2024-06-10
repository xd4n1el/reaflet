import { ReactNode, forwardRef, memo, useImperativeHandle } from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import Element from '@components/Factory/Element';
import { LatLng, LatLngExpression } from 'leaflet';
import MarkerFactory, { MarkerOptions } from './Factory';

import {
  compareObjects,
  excludeEvents,
  excludeProperties,
} from '@utils/functions';

interface MarkerDefaultProps {
  position?: LatLngExpression;
  children?: ReactNode;
}

export type MarkerProps<T = any> = MarkerDefaultProps &
  Omit<MarkerOptions<T>, 'icon'> &
  Omit<EventHandlers, 'onSpiderfied' | 'onUnspiderfied'>;

export type MarkerRef<T = any> = MarkerFactory<T>;

const Marker = memo(
  forwardRef<MarkerRef, MarkerProps>(({ position, children, ...rest }, ref) => {
    const { element } = useElementFactory<
      MarkerFactory,
      [LatLngExpression, MarkerOptions]
    >({
      Factory: MarkerFactory,
      options: [position!, rest],
    });
    useElementEvents({ element, props: rest });
    useElementLifeCycle<any, MarkerFactory>({ element });
    useElementUpdate<MarkerFactory, MarkerDefaultProps & MarkerOptions>({
      element,
      props: { ...rest, position },
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

          const x = new LatLng(prevPosition?.lat, prevPosition?.lng);
          const y = new LatLng(nextPosition?.lat, nextPosition?.lng);

          if (x.equals(y)) return;

          instance?.setLatLng(nextValue!);
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
          } else if (isDraggable && nextValue) {
            instance?.dragging?.enable();
          }
        },
        allProps(prevValues, nextValues, element) {
          let prevProps = excludeProperties<MarkerProps>(prevValues, [
            'position',
            'data',
            'draggable',
            'position',
            'children',
          ]);

          let nextProps = excludeProperties<MarkerProps>(nextValues, [
            'position',
            'data',
            'draggable',
            'position',
            'children',
          ]);

          prevProps = excludeEvents<MarkerProps>(prevProps as any);
          nextProps = excludeEvents<MarkerProps>(nextProps as any);

          const changes = compareObjects(prevProps, nextProps);

          if (Object.keys(changes)?.length > 0) {
            element?.setOptions(changes);
          }
        },
      },
    });
    useImperativeHandle(ref, () => element!, [element]);

    return <Element container={element}>{children}</Element>;
  }),
);

export default Marker;
