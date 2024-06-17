import {
  ReactNode,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
} from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementParent } from '@hooks/useElementParent';
import { useElementUpdate } from '@hooks/useElementUpdate';

import Element from '@components/Factory/Element';
import LayerGroupFactory, { LayerGroupOptions } from './Factory';

import { InvalidMethods } from '@utils/types';

interface CustomLayerGroupProps {
  children?: ReactNode;
}

type Events = Omit<EventHandlers, 'onSpiderfied' | 'onUnspiderfied'>;
type Factory = Omit<LayerGroupFactory, InvalidMethods>;

export type LayerGroupProps = CustomLayerGroupProps &
  LayerGroupOptions &
  Events;
export type LayerGroupRef = Factory;

const LayerGroup = forwardRef<LayerGroupRef, LayerGroupProps>(
  ({ children, ...rest }, ref) => {
    const { container } = useElementParent();

    const { element } = useElementFactory<
      LayerGroupFactory,
      [LayerGroupOptions]
    >({
      Factory: LayerGroupFactory,
      options: [rest],
    });
    useElementEvents({ element, props: rest });
    useElementUpdate<LayerGroupFactory, LayerGroupProps>({
      element,
      props: { ...rest, children },
      handlers: {
        allProps(prevValues, nextValues, instance) {
          instance.setOptions(nextValues);
        },
      },
    });
    useImperativeHandle(ref, () => element!, [element]);

    useEffect(() => {
      if (!element || !container) return;

      element?.addTo(container);

      return () => {
        element?.remove();
      };
    }, [element, container]);

    return <Element container={element}>{children}</Element>;
  },
);

export default memo(LayerGroup);
