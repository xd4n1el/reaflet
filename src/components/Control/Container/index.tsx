import { HTMLAttributes, ReactNode, forwardRef, memo } from 'react';

import Wrapper from './Wrapper';
import ControlElement from './ControlElement';
import ControlFactory, { ControlOptions } from './Factory';

interface CustomControlProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export type ControlProps = CustomControlProps & ControlOptions;
export type ControlRef = ControlFactory;

const Container = forwardRef<ControlRef, ControlProps>(
  ({ children, position, ...rest }, ref) => {
    return (
      <Wrapper {...rest}>
        <ControlElement ref={ref} position={position}>
          {children}
        </ControlElement>
      </Wrapper>
    );
  },
);

export default memo(Container);
