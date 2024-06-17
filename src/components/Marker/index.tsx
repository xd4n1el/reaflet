import { ReactNode, forwardRef, memo, useImperativeHandle } from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import Element from '@components/Factory/Element';
import { LatLng, LatLngExpression } from 'leaflet';
import MarkerFactory, { MarkerOptions } from './Factory';

import { InvalidMethods } from '@utils/types';
import { compareObjects } from '@utils/functions';

interface CustomMarkerProps {
  children?: ReactNode;
  position?: LatLngExpression;
  smoothDuration?: number;
}

type Options<T = any> = Omit<MarkerOptions<T>, 'icon' | 'duration'>;
type Events = Omit<EventHandlers, 'onSpiderfied' | 'onUnspiderfied'>;
type Factory<T = any> = Omit<MarkerFactory<T>, InvalidMethods>;

export type MarkerProps<T = any> = CustomMarkerProps & Options<T> & Events;
export type MarkerRef<T = any> = Factory<T>;

const Marker = forwardRef<MarkerRef, MarkerProps>(
  ({ position, children, smoothDuration, keepAtCenter, ...rest }, ref) => {
    const { element } = useElementFactory<
      MarkerFactory,
      [LatLngExpression, MarkerOptions]
    >({
      Factory: MarkerFactory,
      options: [
        position!,
        { ...rest, keepAtCenter, duration: smoothDuration! },
      ],
    });
    useElementEvents({ element, props: rest });
    useElementLifeCycle({ element });
    useElementUpdate<MarkerFactory, CustomMarkerProps & MarkerOptions>({
      element,
      props: {
        ...rest,
        duration: smoothDuration!,
        keepAtCenter,
        position,
      },
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

          if (smoothDuration) {
            instance.slideTo(nextValue!, {
              keepAtCenter,
              duration: smoothDuration,
            });
          } else {
            instance?.setLatLng(nextValue!);
          }
        },
        data(prevValue, nextValue, instance) {
          instance?.setData(nextValue);
        },
        draggable(prevValue, nextValue, instance) {
          const isDraggable = instance?.dragging?.enabled();

          if (isDraggable && !nextValue) {
            instance?.dragging?.disable();
          } else if (!isDraggable && nextValue) {
            instance?.dragging?.enable();
          }
        },
        rotationAngle(prevValue, nextValue, instance) {
          const animate = typeof smoothDuration === 'number';

          instance.setRotationAngle(nextValue as number, { animate });
        },
        interactive(prevValue, nextValue, instance) {
          instance.setInteractive(nextValue as boolean);
        },
        allProps(prevValues, nextValues, instance) {
          const changes = compareObjects(prevValues, nextValues);

          if (Object.keys(changes)?.length > 0) {
            instance?.setOptions(changes as any);
          }
        },
      },
    });
    useImperativeHandle(ref, () => element!, [element]);

    return <Element container={element}>{children}</Element>;
  },
);

export default memo(Marker);
