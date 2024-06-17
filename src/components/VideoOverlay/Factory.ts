import {
  VideoOverlay,
  VideoOverlayOptions as LeafletVideoOverlayOptions,
  LatLngBoundsExpression,
  Util,
  DomUtil,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export type Video = string | string[] | HTMLVideoElement;

export interface VideoOverlayOptions extends LeafletVideoOverlayOptions {}

interface AdditionalMethods extends BaseFactoryMethods<VideoOverlayOptions> {}

export const polygonKeys: (keyof VideoOverlayOptions)[] = [
  'alt',
  'attribution',
  'autoplay',
  'bubblingMouseEvents',
  'className',
  'crossOrigin',
  'errorOverlayUrl',
  'interactive',
  'keepAspectRatio',
  'loop',
  'muted',
  'opacity',
  'pane',
  'playsInline',
  'zIndex',
];

const validateOptions = (options: any): VideoOverlayOptions => {
  const validOptions = filterProperties<VideoOverlayOptions>({
    object: options,
    map: polygonKeys,
  });

  return validOptions as VideoOverlayOptions;
};

export default class VideoOverlayFactory
  extends VideoOverlay
  implements AdditionalMethods
{
  constructor(
    video: Video,
    bounds: LatLngBoundsExpression,
    options: VideoOverlayOptions,
  ) {
    const validOptions = validateOptions(options);

    super(video, bounds, validOptions);
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

  setOptions(newOptions: VideoOverlayOptions) {
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
