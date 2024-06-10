import {
  HTMLAttributes,
  ReactNode,
  forwardRef,
  memo,
  useImperativeHandle,
  useState,
} from 'react';

import Element from '@/components/Factory/Element';

export interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export type WrapperRef = HTMLDivElement;

const Wrapper = forwardRef<WrapperRef, WrapperProps>(
  ({ children, ...rest }, ref) => {
    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

    useImperativeHandle(ref, () => containerRef as any, [containerRef]);

    return (
      <div {...rest} ref={setContainerRef}>
        <Element container={containerRef}>{children}</Element>
      </div>
    );
  },
);

export default memo(Wrapper);
