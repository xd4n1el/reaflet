import {
  TileLayer,
  TileLayerOptions as LeafletTileLayerOptions,
  Util,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface TileLayerOptions
  extends Omit<LeafletTileLayerOptions, 'attribution'> {}

interface AdditionalMethods
  extends Omit<BaseFactoryMethods<TileLayerOptions>, 'setInteractive'> {}

export const tileLayerKeys: (keyof TileLayerOptions)[] = [
  'accessToken',
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

const validateOptions = (options: any): TileLayerOptions => {
  const validOptions = filterProperties<TileLayerOptions>({
    object: options,
    map: tileLayerKeys,
  });

  return validOptions as TileLayerOptions;
};

export default class TileLayerFactory
  extends TileLayer
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
    return Util.stamp(this);
  }

  getNode() {
    return this?.getContainer() as HTMLElement;
  }

  getOptions() {
    return this?.options;
  }

  setOptions(newOptions: TileLayerOptions) {
    const validOptions = validateOptions(newOptions);

    Util.setOptions(this.options, validOptions);
  }
}
