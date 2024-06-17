import {
  LatLngBoundsExpression,
  SVGOverlay,
  ImageOverlayOptions,
  Util,
  DomUtil,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface SVGOverlayOptions extends ImageOverlayOptions {}

interface AdditionalMethods extends BaseFactoryMethods<SVGOverlayOptions> {}

export const SVGOverlayKeys: (keyof SVGOverlayOptions)[] = [
  'className',
  'interactive',
  'pane',
];

const validateOptions = (options: any): SVGOverlayOptions => {
  const validOptions = filterProperties<SVGOverlayOptions>({
    object: options,
    map: SVGOverlayKeys,
  });

  return validOptions as SVGOverlayOptions;
};

export default class SVGOverlayFactory
  extends SVGOverlay
  implements AdditionalMethods
{
  constructor(
    svgImage: string | SVGElement,
    bounds: LatLngBoundsExpression,
    options: SVGOverlayOptions,
  ) {
    const validOptions = validateOptions(options);

    super(svgImage, bounds, validOptions);
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  getNode() {
    const element: any = this?.getElement();

    return element as HTMLElement;
  }

  getOptions() {
    return this?.options;
  }

  setOptions(newOptions: SVGOverlayOptions) {
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
