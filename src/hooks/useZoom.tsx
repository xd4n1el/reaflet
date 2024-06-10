import { useEffect, useState } from 'react';
import { useMap } from '@hooks/useMap';

import { LeafletEvent, Map, ZoomOptions } from 'leaflet';

export const useZoom = () => {
  const [canZoomIn, setCanZoomIn] = useState<boolean>(false);
  const [canZoomOut, setCanZoomOut] = useState<boolean>(false);

  const map = useMap();

  const zoomIn = (options?: ZoomOptions) => {
    const zoom = map?.getZoom();

    map?.setZoom(zoom! + 1, options);
  };

  const zoomOut = (options?: ZoomOptions) => {
    const zoom = map?.getZoom();

    map?.setZoom(zoom! - 1, options);
  };

  const onZoomChange = (event: LeafletEvent) => {
    const target: Map = event.target;
    const maxZoom = target.getMaxZoom();
    const minZoom = target.getMinZoom();
    const zoom = target.getZoom();

    if (zoom >= maxZoom) setCanZoomIn(false);
    else setCanZoomIn(true);

    if (zoom <= minZoom) setCanZoomOut(false);
    else setCanZoomOut(true);
  };

  useEffect(() => {
    if (!map) return;

    map.on('zoomend', onZoomChange);
    map.fireEvent('zoomend');

    return () => {
      map.off('zoomend', onZoomChange);
    };
  }, [map]);

  return { canZoomIn, canZoomOut, zoomIn, zoomOut };
};
