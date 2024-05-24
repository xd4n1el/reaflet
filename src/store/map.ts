import { create } from 'zustand';
import { Map } from 'leaflet';

export interface MapStore {
  map?: Map;
  createMap: (map: Map) => void;
  destroyMap: () => void;
}

export const useMapStore = create<MapStore>(set => ({
  map: undefined,
  createMap: (map: Map) => set({ map }),
  destroyMap: () => set({ map: undefined }),
}));
