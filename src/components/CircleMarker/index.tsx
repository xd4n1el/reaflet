import { forwardRef, memo, useImperativeHandle } from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import { LatLngExpression } from 'leaflet';
import CircleMarkerFactory, {
  CircleMarkerOptions,
  circleMarkerKeys,
} from './Factory';

import { validateNodeClasses } from '@utils/functions';

interface CustomCircleMarkerProps {
  position: LatLngExpression;
}

type Events = Omit<EventHandlers, 'onSpiderfied' | 'onUnspiderfied'>;

export type CircleMarkerProps = CustomCircleMarkerProps &
  CircleMarkerOptions &
  Events;

export type CircleMarkerRef = CircleMarkerFactory;

const CircleMarker = forwardRef<CircleMarkerRef, CircleMarkerProps>(
  ({ position, ...rest }, ref) => {
    const { element } = useElementFactory<
      CircleMarkerFactory,
      [LatLngExpression, CircleMarkerOptions]
    >({
      Factory: CircleMarkerFactory,
      options: [position, rest],
    });
    useElementEvents({ element, props: rest });
    useElementUpdate<CircleMarkerFactory, CircleMarkerProps>({
      element,
      props: { ...rest, position },
      handlers: {
        position(prevValue, nextValue, instance) {
          instance.setLatLng(nextValue);
        },
        radius(prevValue, nextValue, instance) {
          instance.setRadius(nextValue);
        },
        className(prevValue, nextValue, instance) {
          const node = instance?.getNode();

          if (!node) return;

          validateNodeClasses(prevValue!, nextValue!, node);
        },
        interactive(prevValue, nextValue, instance) {
          if (typeof nextValue !== 'boolean') return;

          instance.setInteractive(nextValue);
        },
        allProps(prevValues, nextValues, instance) {
          const styleOptions: any = {};

          circleMarkerKeys.forEach((key: string) => {
            const nextValue = (nextValues as any)[key];
            const prevValue = (prevValues as any)[key];

            if (nextValue !== undefined && nextValue !== prevValue) {
              styleOptions[key] = nextValue;
            }
          });

          if (Object.keys(styleOptions).length > 0) {
            instance.setStyle(styleOptions);
          }
        },
      },
    });
    useElementLifeCycle({ element });
    useImperativeHandle(ref, () => element!, [element]);

    return null;
  },
);

export default memo(CircleMarker);
