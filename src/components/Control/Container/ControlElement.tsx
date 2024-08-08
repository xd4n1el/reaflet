import {
  ReactNode,
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
} from 'react';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementParent } from '@hooks/useElementParent';
import { useElementUpdate } from '@hooks/useElementUpdate';

import { ControlProvider } from '@context/Control';
import ControlFactory, { ControlOptions } from './Factory';
import ElementPortal, {
  ElementPortalRef,
} from '@components/Factory/ElementPortal';

interface CustomControlProps {
  children?: ReactNode;
}

export type ControlProps = CustomControlProps & ControlOptions;
export type ControlRef = ControlFactory;

const ControlElement = forwardRef<ControlRef, ControlProps>(
  ({ children, position, ...rest }, ref) => {
    const elementPortalRef = useRef<ElementPortalRef>(null);

    const { container } = useElementParent();
    const { element } = useElementFactory<
      ControlFactory,
      [HTMLElement, ControlOptions]
    >({
      Factory: ControlFactory,
      options: [container, { ...rest, position }],
      validation: {
        containerIsRequired: true,
      },
    });
    useElementLifeCycle({
      element,
      afterAdd() {
        elementPortalRef.current?.update();
      },
    });
    useElementUpdate<ControlFactory, ControlOptions>({
      element,
      props: { ...rest, position },
      handlers: {
        position(prevValue, nextValue, instance) {
          if (prevValue === nextValue) return;

          instance.setPosition(nextValue);
        },
      },
    });

    useImperativeHandle(ref, () => element!, [element]);

    return (
      <ControlProvider value={{ position }}>
        <ElementPortal ref={elementPortalRef} element={element}>
          {children}
        </ElementPortal>
      </ControlProvider>
    );
  },
);

export default memo(ControlElement);
