interface Bounds {
  northEast: { lat: number; lng: number };
  southWest: { lat: number; lng: number };
}

export const WorldBounds: Bounds = {
  northEast: { lat: 89.99346179538875, lng: 180 },
  southWest: { lat: -89.98155760646617, lng: -180 },
};
