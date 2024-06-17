import {
  Rectangle as Rectangle,
  PolylineOptions,
  LatLngBoundsExpression,
  Util,
  DomUtil,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface RectangleOptions extends PolylineOptions {}

interface AdditionalMethods extends BaseFactoryMethods<RectangleOptions> {}

export const rectangleKeys: (keyof RectangleOptions)[] = [
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

const validateOptions = (options: any): RectangleOptions => {
  const validOptions = filterProperties<RectangleOptions>({
    object: options,
    map: rectangleKeys,
  });

  return validOptions as RectangleOptions;
};

export default class RectangleFactory
  extends Rectangle
  implements AdditionalMethods
{
  constructor(position: LatLngBoundsExpression, options: RectangleOptions) {
    const validOptions = validateOptions(options);

    super(position, validOptions);
  }

  getLeafletId() {
    return (this as any)?._leaflet_id;
  }

  getNode() {
    return this?.getElement() as HTMLElement;
  }

  getOptions() {
    return this?.options;
  }

  setOptions(newOptions: RectangleOptions) {
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
