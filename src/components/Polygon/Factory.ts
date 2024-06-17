import {
  DomUtil,
  LatLngExpression,
  Polygon,
  PolylineOptions,
  Util,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@/utils/interfaces';

export type Position =
  | LatLngExpression[]
  | LatLngExpression[][]
  | LatLngExpression[][][];

export interface PolygonOptions extends PolylineOptions {}

interface AdditionalMethods extends BaseFactoryMethods<PolygonOptions> {}

export const polygonKeys: (keyof PolygonOptions)[] = [
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

const validateOptions = (options: any): PolygonOptions => {
  const validOptions = filterProperties<PolygonOptions>({
    object: options,
    map: polygonKeys,
  });

  return validOptions as PolygonOptions;
};

export default class PolygonFactory
  extends Polygon
  implements AdditionalMethods
{
  constructor(positions: Position, options: PolygonOptions) {
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

  setOptions(newOptions: PolygonOptions) {
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
