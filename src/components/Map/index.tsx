import { forwardRef, memo } from 'react';
import { EventHandlers } from '@hooks/useElementEvents';

import Container, { ContainerProps } from './Container';
import MapElement, { MapElementProps } from './MapElement';

export interface CustomMapProps extends MapElementProps {
  children?: React.ReactNode;
  containerAttributes?: Omit<ContainerProps, 'children'>;
}

export type MapProps = CustomMapProps & EventHandlers;
export type MapRef = HTMLDivElement;

import '@styles/Reaflet.css';

const Map = forwardRef<MapRef, MapProps>(
  ({ children, containerAttributes = {}, ...rest }, ref) => {
    return (
      <Container {...containerAttributes} ref={ref}>
        <MapElement {...rest}>{children}</MapElement>
      </Container>
    );
  },
);

export default memo(Map);
