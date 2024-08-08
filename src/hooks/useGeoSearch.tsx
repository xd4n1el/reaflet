import { useCallback, useEffect, useState } from 'react';
import { useMap } from './useMap';

import { Control } from 'leaflet';
import {
  OpenStreetMapProvider,
  GoogleProvider,
  MapBoxProvider,
  GeoSearchControl,
  SearchControl,
} from 'leaflet-geosearch';
import { GoogleProviderOptions } from 'leaflet-geosearch/dist/providers/googleProvider';
import { MapBoxProviderOptions } from 'leaflet-geosearch/dist/providers/mapBoxProvider';
import { OpenStreetMapProviderOptions } from 'leaflet-geosearch/dist/providers/openStreetMapProvider';

import 'leaflet-geosearch/assets/css/leaflet.css';

type SearchController = typeof SearchControl & Control;

type NameMap = 'open-streetmap' | 'google' | 'mapbox';

type ProviderOptionsMap = {
  google: GoogleProviderOptions;
  mapbox: MapBoxProviderOptions;
  'open-streetmap': OpenStreetMapProviderOptions;
};

type Provider = GoogleProvider | MapBoxProvider | OpenStreetMapProvider;

interface Result {
  x: number; // Longitude
  y: number; // Latitude
  label: string; // Endereço formatado
  bounds: [
    [number, number], // Sul e Oeste - Latitude, Longitude
    [number, number], // Norte e Leste - Latitude, Longitude
  ];
  raw: any; // Resultado bruto do provedor (ajuste o tipo conforme necessário)
}

export interface SearchOptions {
  resultFormat?: (options: Result) => string;
  provider: Provider;
  maxMarkers?: number;
  searchLabel?: string;
  autoClose?: boolean;
  showPopup?: boolean;
  updateMap?: boolean;
  showMarker?: boolean;
  keepResult?: boolean;
  animateZoom?: boolean;
  retainZoomLevel?: boolean;
}

export const createProvider = <T extends NameMap>(
  name: T,
  options?: ProviderOptionsMap[T],
) => {
  switch (name) {
    case 'google':
      return new GoogleProvider(options as ProviderOptionsMap['google']);
    case 'mapbox':
      return new MapBoxProvider(options as ProviderOptionsMap['mapbox']);
    case 'open-streetmap':
      return new OpenStreetMapProvider(
        options as ProviderOptionsMap['open-streetmap'],
      );
    default:
      throw new Error('Unknown provider');
  }
};

const useGeoSearch = (
  { provider, ...rest }: SearchOptions = {} as any,
): SearchController => {
  const [searchControl, setSearchControl] = useState<SearchController>();

  const map = useMap();

  useEffect(() => {
    if (!map) return;

    return init();
  }, [map]);

  const init = useCallback(() => {
    const control = GeoSearchControl({
      ...rest,
      provider,
    });

    map?.addControl(control);

    setSearchControl(control as any);

    control.markers.remove();

    return () => {
      map?.removeControl(control);
    };
  }, [map]);

  return searchControl as any;
};

export default useGeoSearch;
