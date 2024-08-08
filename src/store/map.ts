import { create } from 'zustand';
import { Map } from 'leaflet';

export interface MapStore {
  map?: Map;
  createMap: (map: Map) => void;
  destroyMap: () => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  map: undefined,
  createMap(map: Map) {
    if (get().map) throw new Error('Map already initialized.');

    set({ map });
  },
  destroyMap() {
    set({ map: undefined });
  },
}));
