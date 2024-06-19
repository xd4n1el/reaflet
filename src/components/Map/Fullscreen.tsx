import { ReactNode, memo, useEffect } from 'react';
import { useFullscreen } from '@hooks/useFullscreen';
import {
  useFullScreenHandle,
  FullScreen as FullScreenContainer,
} from 'react-full-screen';

export interface FullscreenProps {
  children?: ReactNode;
}

const FullScreen = memo<FullscreenProps>(({ children }) => {
  const handle = useFullScreenHandle();
  const { addController } = useFullscreen();

  useEffect(() => {
    if (!handle) return;

    addController(handle);
  }, [handle]);

  return (
    <FullScreenContainer handle={handle} className="leaflet-fullscreen">
      {children}
    </FullScreenContainer>
  );
});

export default FullScreen;
