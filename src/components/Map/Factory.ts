import { Map, MapOptions as LeafletMapOptions, Util } from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface MapOptions extends LeafletMapOptions {}

interface AdditionalMethods
  extends Omit<BaseFactoryMethods<MapOptions>, 'setInteractive'> {}

export const mapKeys: (keyof MapOptions)[] = [
  'bounceAtZoomLimits',
  'boxZoom',
  'center',
  'closePopupOnClick',
  'crs',
  'doubleClickZoom',
  'dragging',
  'easeLinearity',
  'fadeAnimation',
  'inertia',
  'inertiaDeceleration',
  'inertiaMaxSpeed',
  'keyboard',
  'keyboardPanDelta',
  'markerZoomAnimation',
  'maxBounds',
  'maxZoom',
  'minZoom',
  'preferCanvas',
  'renderer',
  'scrollWheelZoom',
  'tap',
  'tapTolerance',
  'touchZoom',
  'trackResize',
  'transform3DLimit',
  'wheelDebounceTime',
  'wheelPxPerZoomLevel',
  'worldCopyJump',
  'zoom',
  'zoomAnimation',
  'zoomAnimationThreshold',
  'zoomDelta',
  'zoomSnap',
  'attributionControl',
];

const validateOptions = (options: any): MapOptions => {
  const validOptions = filterProperties<MapOptions>({
    object: options,
    map: mapKeys,
  });

  return validOptions as MapOptions;
};

export default class MapFactory extends Map implements AdditionalMethods {
  constructor(container: string | HTMLElement, options?: MapOptions) {
    const validOptions = validateOptions(options);

    super(container, {
      ...validOptions,
      zoomControl: false,
    });
  }

  getLeafletId(): number | undefined {
    return Util.stamp(this);
  }

  getNode() {
    return this?.getContainer();
  }

  getOptions(): MapOptions {
    return this?.options;
  }

  setOptions(newOptions: MapOptions) {
    const validOptions = validateOptions(newOptions);

    Util.setOptions(this.options, validOptions);
  }
}
