import {
  ReactNode,
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
} from 'react';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

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

  const { element } = useElementFactory<
    AttributionControlFactory,
    [AttributionControlOptions]
  >({
    Factory: AttributionControlFactory,
    options: [rest],
  });
  useElementLifeCycle({
    element,
    afterAdd() {
      elementPortalRef?.current?.update();
    },
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

  useImperativeHandle(ref, () => element!, [element]);

  return (
    <ElementPortal ref={elementPortalRef} element={element}>
      {children}
    </ElementPortal>
  );
});

export default memo(AttributionControl);
