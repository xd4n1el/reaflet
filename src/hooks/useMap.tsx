import { useMapStore } from '../store/map';

export const useMap = () => {
  const { map } = useMapStore(state => state);

  return map;
};
