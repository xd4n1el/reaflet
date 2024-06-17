import {
  ReactNode,
  SVGProps,
  forwardRef,
  memo,
  useImperativeHandle,
  useState,
} from 'react';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';

import Container from './Container';
import SVGOverlayElement, {
  SVGOverlayElementRef,
  SVGOverlayElementProps,
} from './SVOverlayElement';

export type SVG = string | SVGElement;

export interface SVGOverlayProps extends SVGOverlayElementProps {
  children: ReactNode;
  attributes?: SVGProps<SVGSVGElement>;
}

const SVGOverlay = forwardRef<SVGOverlayElementRef, SVGOverlayProps>(
  ({ children, attributes, ...rest }, ref) => {
    const [element, setElement] = useState<SVGOverlayElementRef | null>(null);

    useElementLifeCycle({ element });
    useImperativeHandle(ref, () => element!, [element]);

    return (
      <Container {...attributes}>
        {children}
        <SVGOverlayElement ref={setElement} {...rest} />
      </Container>
    );
  },
);

export default memo(SVGOverlay);
