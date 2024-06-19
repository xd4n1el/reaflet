import {
  HTMLAttributes,
  ReactNode,
  forwardRef,
  memo,
  useImperativeHandle,
  useState,
} from 'react';

import FullScreen from './Fullscreen';
import Element from '@components/Factory/Element';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export type ContainerRef = HTMLDivElement;

const Container = forwardRef<ContainerRef, ContainerProps>(
  ({ children, ...rest }, ref): ReactNode => {
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(
      null,
    );

    useImperativeHandle(ref, () => containerRef!, [containerRef]);

    return (
      <FullScreen>
        <div {...rest} id="leaflet-container" ref={setContainerRef}>
          <Element container={containerRef}>{children}</Element>
        </div>
      </FullScreen>
    );
  },
);

export default memo(Container);
