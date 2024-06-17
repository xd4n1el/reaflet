import { forwardRef, memo, useImperativeHandle } from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import { LatLngBoundsExpression } from 'leaflet';
import RectangleFactory, { RectangleOptions, rectangleKeys } from './Factory';

interface CustomRectangleProps {
  position: LatLngBoundsExpression;
}

type Events = Omit<EventHandlers, 'onSpiderfied' | 'onUnspiderfied'>;

export type RectangleProps = CustomRectangleProps & RectangleOptions & Events;
export type RectangleRef = RectangleFactory;

const Rectangle = forwardRef<RectangleRef, RectangleProps>(
  ({ position, ...rest }, ref) => {
    const { element } = useElementFactory<
      RectangleFactory,
      [LatLngBoundsExpression, RectangleOptions]
    >({
      Factory: RectangleFactory,
      options: [position, rest],
    });
    useElementLifeCycle({ element });
    useElementEvents({ element, props: rest });
    useElementUpdate<RectangleFactory, RectangleProps>({
      element,
      props: { ...rest, position },
      handlers: {
        position(prevValue, nextValue, instance) {
          instance.setBounds(position);
        },
        allProps(prevValues, nextValues, instance) {
          const styleOptions: any = {};

          rectangleKeys.forEach((key: string) => {
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

export default memo(Rectangle);
