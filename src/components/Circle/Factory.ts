import {
  Circle,
  CircleOptions as CircleFactoryOptions,
  DomUtil,
  LatLngExpression,
  Util,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface CircleOptions extends CircleFactoryOptions {}

interface AdditionalMethods extends BaseFactoryMethods<CircleOptions> {}

export const circleKeys: (keyof CircleOptions)[] = [
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
  'opacity',
  'pane',
  'renderer',
  'stroke',
  'weight',
  'radius',
];

const validateOptions = (options: any): CircleOptions => {
  const validOptions = filterProperties<CircleOptions>({
    object: options,
    map: circleKeys,
  });

  return validOptions as CircleOptions;
};

export default class CircleFactory extends Circle implements AdditionalMethods {
  constructor(position: LatLngExpression, options: CircleOptions) {
    const validOptions = validateOptions(options);

    super(position, validOptions);
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  getNode() {
    return this.getElement() as HTMLElement;
  }

  getOptions() {
    return this.options;
  }

  setOptions(newOptions: CircleOptions) {
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
