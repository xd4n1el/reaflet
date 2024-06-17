import { forwardRef, memo, useImperativeHandle } from 'react';
import { useElementFactory } from '@hooks/useElementFactory';

import PolylineFactory, {
  Position,
  PolylineOptions,
  polylineKeys,
} from './Factory';
import { EventHandlers, useElementEvents } from '@/hooks/useElementEvents';
import { useElementUpdate } from '@/hooks/useElementUpdate';
import { useElementLifeCycle } from '@/hooks/useElementLifeCycle';

interface CustomPolylineProps {
  positions: Position;
}

type Events = Omit<EventHandlers, 'onSpiderfied' | 'onUnspiderfied'>;

export type PolylineProps = CustomPolylineProps & PolylineOptions & Events;
export type PolylineRef = PolylineFactory;

const Polyline = forwardRef<PolylineRef, PolylineProps>(
  ({ positions, ...rest }, ref) => {
    const { element } = useElementFactory<
      PolylineFactory,
      [Position, PolylineOptions]
    >({
      Factory: PolylineFactory,
      options: [positions, rest],
    });
    useElementLifeCycle({ element });
    useElementEvents({ element, props: rest });
    useElementUpdate<PolylineFactory, PolylineProps>({
      element,
      props: { ...rest, positions },
      handlers: {
        positions(prevValue, nextValue, instance) {
          instance.setLatLngs(nextValue);
        },
        interactive(prevValue, nextValue, instance) {
          if (typeof nextValue !== 'boolean') return;

          instance.setInteractive(nextValue);
        },
        allProps(prevValues, nextValues, instance) {
          const styleOptions: any = {};

          polylineKeys.forEach((key: string) => {
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

export default memo(Polyline);
