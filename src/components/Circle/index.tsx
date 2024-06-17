import { forwardRef, memo, useImperativeHandle } from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import { LatLngExpression } from 'leaflet';
import CircleFactory, { CircleOptions, circleKeys } from './Factory';

import { validateNodeClasses } from '@utils/functions';

interface CustomCircleProps {
  position: LatLngExpression;
  radius: number;
}

export type CircleProps = CustomCircleProps & CircleOptions & EventHandlers;
export type CircleRef = CircleFactory;

const Circle = forwardRef<CircleRef, CircleProps>(
  ({ position, radius, ...rest }, ref) => {
    const { element } = useElementFactory<
      CircleFactory,
      [LatLngExpression, CircleOptions]
    >({
      Factory: CircleFactory,
      options: [position, { ...rest, radius }],
    });
    useElementLifeCycle({ element });
    useElementEvents({ element, props: rest });
    useElementUpdate<CircleFactory, CircleProps>({
      element,
      props: { ...rest, position, radius },
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

          circleKeys.forEach((key: string) => {
            const nextValue = (nextValues as any)[key];
            const prevValue = (prevValues as any)[key];

            if (nextValue && nextValue !== prevValue) {
              styleOptions[key] = nextValue;
            }
          });

          if (Object.keys(styleOptions).length > 0) {
            instance.setStyle(styleOptions);
          }
        },
      },
    });
    useImperativeHandle(ref, () => element!, [element]);

    return null;
  },
);

export default memo(Circle);
