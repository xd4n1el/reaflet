import { ButtonHTMLAttributes, forwardRef, memo } from 'react';
import { useZoom } from '@hooks/useZoom';

export interface ZoomOutButtonProps<T = any> extends ButtonHTMLAttributes<T> {}
export type ZoomOutButtonRef = HTMLButtonElement;

const ZoomOutButton = forwardRef<ZoomOutButtonRef, ZoomOutButtonProps>(
  (props, ref) => {
    const { canZoomOut, zoomOut } = useZoom();

    return (
      <button
        {...props}
        ref={ref}
        title="zoom Out"
        aria-label="zoom Out"
        disabled={!canZoomOut}
        className={`leaflet-control-zoom-out leaflet-button ${!canZoomOut ? 'leaflet-disabled' : ''}`}
        onClick={zoomOut as any}>
        -
      </button>
    );
  },
);

export default memo(ZoomOutButton);
