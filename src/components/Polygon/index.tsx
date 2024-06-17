import { forwardRef, memo, useImperativeHandle } from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import { LatLng } from 'leaflet';
import PolygonFactory, {
  PolygonOptions,
  Position,
  polygonKeys,
} from './Factory';

import { InvalidMethods } from '@utils/types';
import { validateNodeClasses } from '@utils/functions';

interface CustomPolygonProps {
  positions: Position;
}

type Events = Omit<EventHandlers, 'onSpiderfied' | 'onUnspiderfied'>;
type Factory = Omit<PolygonFactory, InvalidMethods>;

export type PolygonProps = CustomPolygonProps & PolygonOptions & Events;
export type PolygonRef = Factory;

const Polygon = forwardRef<PolygonRef, PolygonProps>(
  ({ positions, ...rest }, ref) => {
    const { element } = useElementFactory<
      PolygonFactory,
      [Position, PolygonOptions]
    >({
      Factory: PolygonFactory,
      options: [positions, rest],
    });
    useElementLifeCycle({ element });
    useElementEvents({ element, props: rest });
    useElementUpdate<PolygonFactory, PolygonProps>({
      element,
      props: { ...rest, positions },
      handlers: {
        positions(prevValue, nextValue, instance) {
          let changed = false;

          nextValue.forEach((latlng, index) => {
            if (!(prevValue[index] as LatLng).equals(latlng as LatLng)) {
              changed = true;
            }
          });

          if (!changed) return;

          instance.setLatLngs(nextValue);
        },
        className(prevValue, nextValue, instance) {
          const node = instance.getNode();

          if (!node) return;

          validateNodeClasses(prevValue!, nextValue!, node);
        },
        interactive(prevValue, nextValue, instance) {
          if (typeof nextValue !== 'boolean') return;

          instance.setInteractive(nextValue as boolean);
        },
        allProps(prevValues, nextValues, instance) {
          const styleOptions: any = {};

          polygonKeys.forEach((key: string) => {
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

    useImperativeHandle(ref, () => element!, [element]);

    return null;
  },
);

export default memo(Polygon);
