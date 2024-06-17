import {
  DomUtil,
  ImageOverlay,
  LatLngBoundsExpression,
  ImageOverlayOptions as LeafletImageOverlayOptions,
  Util,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface ImageOverlayOptions extends LeafletImageOverlayOptions {}

interface AdditionalMethods extends BaseFactoryMethods<ImageOverlayOptions> {}

export const imageOverlayKeys: (keyof ImageOverlayOptions)[] = [
  'attribution',
  'className',
  'crossOrigin',
  'alt',
  'bubblingMouseEvents',
  'errorOverlayUrl',
  'opacity',
  'pane',
  'zIndex',
];

const validateOptions = (options: any): ImageOverlayOptions => {
  const validOptions = filterProperties<ImageOverlayOptions>({
    object: options,
    map: imageOverlayKeys,
  });

  return validOptions as ImageOverlayOptions;
};

export default class ImageOverlayFactory
  extends ImageOverlay
  implements AdditionalMethods
{
  constructor(
    url: string,
    bounds: LatLngBoundsExpression,
    options: ImageOverlayOptions,
  ) {
    const validOptions = validateOptions(options);

    super(url, bounds, validOptions);
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  getNode() {
    return this?.getElement();
  }

  getOptions() {
    return this?.options;
  }

  setOptions(newOptions: ImageOverlayOptions) {
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
