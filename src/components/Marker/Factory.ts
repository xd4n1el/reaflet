import { DomUtil, LatLngExpression, Util } from 'leaflet';

import RotatedMarker, {
  RotatedMarkerOptions,
} from '@utils/classes/RotatedMarker';
import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';
import { SlideOptions } from '@utils/classes/DriftMarker';

export interface BaseMarkerOptions extends RotatedMarkerOptions, SlideOptions {}

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

export const markerKeys: (keyof MarkerOptions)[] = [
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

const validateOptions = (options: any): MarkerOptions => {
  const validOptions = filterProperties<MarkerOptions>({
    object: options,
    map: markerKeys,
  });

  return validOptions as MarkerOptions;
};

export default class MarkerFactory<T = any>
  extends RotatedMarker
  implements AdditionalMethods
{
  private data?: T;

  constructor(position: LatLngExpression, options: MarkerOptions) {
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

  getLeafletId() {
    return Util.stamp(this);
  }

  getNode() {
    return this?.getElement();
  }

  getOptions() {
    return this.options as any;
  }

  setOptions(newOptions: MarkerOptions) {
    const validOptions = validateOptions(newOptions);

    Util.setOptions(this.options, validOptions);
  }

  setInteractive(interactive: boolean) {
    this.options.interactive = interactive;

    const node = this.getNode();

    if (!node) return;

    if (interactive) {
      DomUtil.addClass(node, 'leaflet-interactive');
      this.addInteractiveTarget(node);
    } else {
      DomUtil.removeClass(node, 'leaflet-interactive');
      this.removeInteractiveTarget(node);
    }
  }
}
