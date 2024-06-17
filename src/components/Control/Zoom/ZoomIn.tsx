import { ButtonHTMLAttributes, forwardRef, memo } from 'react';
import { useZoom } from '@hooks/useZoom';

export interface ZoomInButtonProps<T = any> extends ButtonHTMLAttributes<T> {}
export type ZoomInButtonRef = HTMLButtonElement;

const ZoomInButton = forwardRef<ZoomInButtonRef, ZoomInButtonProps>(
  (props, ref) => {
    const { canZoomIn, zoomIn } = useZoom();

    return (
      <button
        {...props}
        ref={ref}
        title="zoom In"
        aria-label="zoom In"
        disabled={!canZoomIn}
        className={`leaflet-control-zoom-in leaflet-button ${!canZoomIn ? 'leaflet-disabled' : ''}`}
        onClick={zoomIn as any}>
        +
      </button>
    );
  },
);

export default memo(ZoomInButton);
