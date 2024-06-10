import { LatLngExpression } from 'leaflet';
import RotatedMarker, {
  RotatedMarkerOptions,
} from '@/utils/classes/RotatedMarker';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface BaseMarkerOptions
  extends Omit<RotatedMarkerOptions, 'rotationOrigin'> {}

export interface DynamicMarkerOptions<D = any> {
  /**
   * Custom data to be passed into Marker instance
   * @default undefined
   */
  data?: D;
}

export type MarkerOptions<D = any> = BaseMarkerOptions &
  DynamicMarkerOptions<D>;

interface AdditionalMethods<T = any> extends BaseFactoryMethods<MarkerOptions> {
  setData: (newData: T) => void;
  getData: () => T | undefined;
}

const validateOptions = (options: any): MarkerOptions => {
  const keys: (keyof MarkerOptions)[] = [
    'alt',
    'attribution',
    'autoPan',
    'autoPanOnFocus',
    'autoPanPadding',
    'autoPanSpeed',
    'bubblingMouseEvents',
    'data',
    'draggable',
    'interactive',
    'keyboard',
    'opacity',
    'pane',
    'riseOffset',
    'riseOnHover',
    'rotationAngle',
    'shadowPane',
    'title',
    'zIndexOffset',
  ];

  const validOptions = filterProperties<MarkerOptions>({
    object: options,
    map: keys,
  });

  return validOptions as MarkerOptions;
};

export default class Marker<T = any>
  extends RotatedMarker
  implements AdditionalMethods
{
  private data?: T;

  constructor(position: LatLngExpression, options: MarkerOptions = {}) {
    const validOptions = validateOptions(options);

    const { data, ...rest } = validOptions || {};

    super(position, rest);

    this.data = data;
  }

  setData(data: T): void {
    this.data = data;
  }

  getData(): T | undefined {
    return this.data;
  }

  getLeafletId(): number | undefined {
    return (this as any)._leaflet_id;
  }

  getNode() {
    return (this as any)._icon;
  }

  setOptions(newOptions: MarkerOptions) {
    const validOptions = validateOptions(newOptions);

    Object.assign(this.options, validOptions);
  }
}
