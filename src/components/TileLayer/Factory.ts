import { filterProperties } from '@/utils/functions';
import { BaseFactoryMethods } from '@/utils/interfaces';
import {
  TileLayer as TileLayerFactory,
  TileLayerOptions as TileLayerFactoryOptions,
} from 'leaflet';

export interface TileLayerOptions extends TileLayerFactoryOptions {}

interface AdditionalMethods extends BaseFactoryMethods {}

const validateOptions = (options: any): TileLayerOptions => {
  const keys: (keyof TileLayerOptions)[] = [
    'accessToken',
    'attribution',
    'bounds',
    'className',
    'crossOrigin',
    'detectRetina',
    'errorTileUrl',
    'id',
    'keepBuffer',
    'maxNativeZoom',
    'maxZoom',
    'minNativeZoom',
    'minZoom',
    'noWrap',
    'opacity',
    'pane',
    'referrerPolicy',
    'subdomains',
    'tileSize',
    'tms',
    'updateInterval',
    'updateWhenIdle',
    'updateWhenZooming',
    'zIndex',
    'zoomOffset',
    'zoomReverse',
  ];

  const validOptions = filterProperties<TileLayerOptions>({
    object: options,
    map: keys,
  });

  return validOptions as TileLayerOptions;
};

export default class TileLayer
  extends TileLayerFactory
  implements AdditionalMethods
{
  private URL: string | undefined;

  constructor(urlTemplate: string, options: TileLayerOptions) {
    const validOptions = validateOptions(options);

    super(urlTemplate, validOptions);
    this.URL = urlTemplate;
  }

  getURL() {
    return this.URL;
  }

  getLeafletId() {
    return (this as any)?._leaflet_id;
  }

  getNode() {
    return this.getContainer() as HTMLElement;
  }

  getOptions() {
    return this.options;
  }

  setOptions(newOptions: TileLayerOptions) {
    const validOptions = validateOptions(newOptions);

    Object.assign(this.options, validOptions);
  }
}
