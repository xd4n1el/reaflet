import { useElementFactory } from '@/hooks/useElementFactory';
import {
  ReactNode,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
} from 'react';
import FeatureGroupFactory, { FeatureGroupOptions } from './Factory';
import { EventHandlers, useElementEvents } from '@/hooks/useElementEvents';
import { useElementUpdate } from '@/hooks/useElementUpdate';
import { useElementParent } from '@/hooks/useElementParent';
import Element from '../Factory/Element';

interface CustomFeatureGroupProps {
  children: ReactNode;
}

type Events = Omit<EventHandlers, 'onSpiderfied' | 'onUnspiderfied'>;

export type FeatureGroupProps = CustomFeatureGroupProps &
  FeatureGroupOptions &
  Events;

export type FeatureGroupRef = FeatureGroupFactory;

const FeatureGroup = forwardRef<FeatureGroupRef, FeatureGroupProps>(
  ({ children, ...rest }, ref) => {
    const { container } = useElementParent();
    const { element } = useElementFactory<
      FeatureGroupFactory,
      [FeatureGroupOptions]
    >({
      Factory: FeatureGroupFactory,
      options: [rest],
    });
    useElementEvents({ element, props: rest });
    useElementUpdate<FeatureGroupFactory, FeatureGroupProps>({
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

export default memo(FeatureGroup);
