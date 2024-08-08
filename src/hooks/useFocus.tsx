import { useEffect } from 'react';
import { useMap } from './useMap';

import { Layer, LeafletEvent, Marker } from 'leaflet';

export interface Options {
  element: Layer;
}

export interface UseFocusHook {
  start: () => void;
  stop: () => void;
}

/** Hook to focus an element on map. */
export const useFocus = ({ element }: Options = {} as any): UseFocusHook => {
  const { setView, dragging } = useMap();

  useEffect(() => {
    if (!element) return;

    start();

    return () => {
      stop();
    };
  }, [element]);

  const onMove = ({ target }: LeafletEvent) => {
    const { getLatLng } = (target as Marker) || {};

    const position = getLatLng?.();

    setView(position);
  };

  const start = () => {
    dragging?.disable();

    element?.addEventListener('move', onMove);
  };

  const stop = () => {
    dragging?.enable();
    element?.removeEventListener('move', onMove);
  };

  return { start, stop };
};
