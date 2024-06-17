import {
  CircleMarker,
  CircleMarkerOptions as CircleMarkerFactoryOptions,
  DomUtil,
  LatLngExpression,
  Util,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface CircleMarkerOptions extends CircleMarkerFactoryOptions {}

interface AdditionalMethods extends BaseFactoryMethods<CircleMarkerOptions> {}

export const circleMarkerKeys: (keyof CircleMarkerOptions)[] = [
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
  'radius',
  'renderer',
  'stroke',
  'weight',
];

const validateOptions = (options: any): CircleMarkerOptions => {
  const validOptions = filterProperties<CircleMarkerOptions>({
    object: options,
    map: circleMarkerKeys,
  });

  return validOptions as CircleMarkerOptions;
};

export default class CircleMarkerFactory
  extends CircleMarker
  implements AdditionalMethods
{
  constructor(position: LatLngExpression, options: CircleMarkerOptions) {
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

  setOptions(newOptions: CircleMarkerOptions) {
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
