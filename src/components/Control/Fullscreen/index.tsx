import { ButtonHTMLAttributes, forwardRef, memo } from 'react';
import { useFullscreen } from '@hooks/useFullscreen';

import { ReactComponent as FullscreenOnIcon } from '@assets/fullscreen_on.svg';
import { ReactComponent as FullscreenOffIcon } from '@assets/fullscreen_off.svg';

export interface FullScreenButtonProps<T = any>
  extends ButtonHTMLAttributes<T> {}

export type FullScreenButtonRef = HTMLButtonElement;

const FullScreenButton = memo(
  forwardRef<FullScreenButtonRef, FullScreenButtonProps>(
    ({ className = '', ...rest }, ref) => {
      const { isActive, enter, exit } = useFullscreen();

      const toggleFullscreen = () => {
        if (isActive) exit?.();
        else enter?.();
      };

      return (
        <button
          {...rest}
          ref={ref}
          onClick={toggleFullscreen}
          className={`leaflet-control-zoom-in leaflet-button ${className}`}>
          {isActive && <FullscreenOnIcon width={22} height={22} />}
          {!isActive && <FullscreenOffIcon width={22} height={22} />}
        </button>
      );
    },
  ),
);

export default FullScreenButton;
