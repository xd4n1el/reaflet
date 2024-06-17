import {
  LatLngExpression,
  Polyline,
  PolylineOptions as LeafletPolylineOptions,
  Util,
  DomUtil,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export type Position = LatLngExpression[] | LatLngExpression[][];

export interface PolylineOptions extends LeafletPolylineOptions {}

export const polylineKeys: (keyof PolylineOptions)[] = [
  'attribution',
  'bubblingMouseEvents',
  'className',
  'color',
  'dashArray',
  'dashOffset',
  'fill',
  'fillColor',
  'fillOpacity',
  'fillRule',
  'interactive',
  'lineCap',
  'lineJoin',
  'noClip',
  'opacity',
  'pane',
  'renderer',
  'smoothFactor',
  'stroke',
  'weight',
];

const validateOptions = (options: any): PolylineOptions => {
  const validOptions = filterProperties<PolylineOptions>({
    object: options,
    map: polylineKeys,
  });

  return validOptions as PolylineOptions;
};

interface AdditionalMethods extends BaseFactoryMethods<PolylineOptions> {}

export default class PolylineFactory
  extends Polyline
  implements AdditionalMethods
{
  constructor(positions: Position, options: LeafletPolylineOptions) {
    const validOptions = validateOptions(options);

    super(positions, validOptions);
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  getNode() {
    return this?.getElement() as HTMLElement;
  }

  getOptions() {
    return this?.options;
  }

  setOptions(newOptions: PolylineOptions) {
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
