import { TileLayer, Util, WMSOptions, WMSParams } from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface TileLayerWMSOptions extends WMSOptions {}

interface AdditionalMethods
  extends Omit<BaseFactoryMethods<TileLayerWMSOptions>, 'setInteractive'> {}

export const tileLayerKeys: (keyof TileLayerWMSOptions)[] = [
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

const validateOptions = (options: any): TileLayerWMSOptions => {
  const validOptions = filterProperties<TileLayerWMSOptions>({
    object: options,
    map: tileLayerKeys,
  });

  return validOptions as TileLayerWMSOptions;
};

export default class TileLayerWMSFactory
  extends TileLayer.WMS
  implements AdditionalMethods
{
  constructor(url: string, options: TileLayerWMSOptions, params?: WMSParams) {
    const validOptions = validateOptions(options);

    super(url, validOptions);

    if (params && Object.keys(params).length > 0) {
      this.setParams(params, false);
    }
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

  setOptions(newOptions: TileLayerWMSOptions) {
    const validOptions = validateOptions(newOptions);

    Util.setOptions(this.options, validOptions);
  }
}
