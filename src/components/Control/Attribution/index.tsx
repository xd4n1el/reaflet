import {
  ReactNode,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';
import { useMap } from '@hooks/useMap';

import AttributionControlFactory, {
  AttributionControlOptions,
} from './Factory';
import { Position } from '../Container/Factory';
import ElementPortal, {
  ElementPortalRef,
} from '@/components/Factory/ElementPortal';

export interface AttributionControlProps
  extends Omit<AttributionControlOptions, 'prefix'> {
  children?: ReactNode;
}
export type AttributionControlRef = AttributionControlFactory;

const AttributionControl = forwardRef<
  AttributionControlRef,
  AttributionControlProps
>(({ children, ...rest }, ref) => {
  const elementPortalRef = useRef<ElementPortalRef>(null);

  const map = useMap();
  const { element } = useElementFactory<
    AttributionControlFactory,
    [AttributionControlOptions]
  >({
    Factory: AttributionControlFactory,
    options: [rest],
  });
  useElementUpdate<AttributionControlFactory, AttributionControlProps>({
    element,
    props: rest,
    handlers: {
      position(prevValue, nextValue, instance) {
        instance.setPosition(nextValue as Position);
      },
      allProps(prevValues, nextValues, instance) {
        instance.setOptions(nextValues as AttributionControlOptions);
      },
    },
  });

  useEffect(() => {
    if (!map || !element) return;

    element?.addTo(map);

    elementPortalRef.current?.update();

    return () => {
      element?.remove();
    };
  }, [map, element]);

  useImperativeHandle(ref, () => element!, [element]);

  return (
    <ElementPortal ref={elementPortalRef} element={element}>
      {children}
    </ElementPortal>
  );
});

export default memo(AttributionControl);
