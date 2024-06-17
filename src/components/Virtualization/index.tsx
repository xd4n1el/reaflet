import {
  ReactNode,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
} from 'react';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementParent } from '@hooks/useElementParent';
import { useMap } from '@hooks/useMap';

import { Map } from 'leaflet';
import Element from '@components/Factory/Element';
import VirtualizationFactory, { VirtualizationOptions } from './Factory';

export interface VirtualizationProps extends VirtualizationOptions {
  children?: ReactNode;
}

export type VirtualizationRef = VirtualizationFactory;

const Virtualization = forwardRef<VirtualizationRef, VirtualizationProps>(
  ({ children, ...rest }, ref) => {
    const { container } = useElementParent();
    const map = useMap();

    const { element } = useElementFactory<
      VirtualizationFactory,
      [Map, any, VirtualizationOptions]
    >({
      Factory: VirtualizationFactory,
      options: [map!, container, rest],
      validation: {
        containerIsRequired: true,
      },
    });

    useImperativeHandle(ref, () => element!, [element]);

    useEffect(() => {
      if (!element) return;

      return () => {
        element?.destroy();
      };
    }, [element]);

    return <Element container={element}>{children}</Element>;
  },
);

export default memo(Virtualization);
