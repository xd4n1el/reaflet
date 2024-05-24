import { memo, useEffect, useRef } from 'react';
import { useMap } from '@hooks/useMap';

import { TileLayer as TileLayerBase, TileLayerOptions } from 'leaflet';

interface TileLayerProps extends L.TileLayerOptions {
  url: string;
}

class CustomTileLayer extends TileLayerBase {
  private URL: string | undefined;

  constructor(urlTemplate: string, options: TileLayerOptions) {
    super(urlTemplate, options);
    this.URL = urlTemplate;
  }

  getURL() {
    return this.URL;
  }
}

const TileLayer = memo(({ url, ...rest }: TileLayerProps) => {
  const tileLayerRef = useRef<CustomTileLayer | undefined>(undefined);

  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const tileLayer = new CustomTileLayer(url, { ...rest });

    map.addLayer(tileLayer);
    tileLayerRef.current = tileLayer;

    return () => {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
    };
  }, [map]);

  return null;
});

export default TileLayer;
