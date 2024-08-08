import { useMapStore } from '@store/map';

import 'leaflet/dist/leaflet.css';

/**
 * Hook that creates a map element.
 *
 * This hook is responsible for creating a map global instance and using provided options and managing its lifecycle.
 *
 * create the map instance and provide to the `@createMap` callback.
 */
export const useMapFactory = () => {
  const { createMap, destroyMap } = useMapStore(state => state);

  return { createMap, destroyMap };
};
