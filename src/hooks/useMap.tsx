import { useMapStore } from '@store/map';

import { Map } from 'leaflet';

/**
 * Hook that allow the access and managing of Leaflet Map instance.
 * @returns The map element.
 */
export const useMap = (): Map => {
  const { map } = useMapStore(state => state);

  return map!;
};
