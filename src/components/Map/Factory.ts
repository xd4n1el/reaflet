import { Map as MapFactory, MapOptions as MapFactoryOptions } from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface MapOptions extends MapFactoryOptions {}

interface AdditionalMethods extends BaseFactoryMethods<MapOptions> {}

const validateOptions = (options: any): MapOptions => {
  const keys: (keyof MapOptions)[] = [
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
  ];

  const validOptions = filterProperties<MapOptions>({
    object: options,
    map: keys,
  });

  return validOptions as MapOptions;
};

export default class Map extends MapFactory implements AdditionalMethods {
  constructor(container: string | HTMLElement, options?: MapOptions) {
    const validOptions = validateOptions(options);

    super(container, {
      ...validOptions,
      zoomControl: false,
    });
  }

  getNode() {
    return this.getContainer();
  }

  getLeafletId(): number | undefined {
    return (this as any)._leaflet_id;
  }

  setOptions(newOptions: MapOptions) {
    const validOptions = validateOptions(newOptions);

    Object.assign(this.options, validOptions);
  }

  getOptions(): MapOptions {
    return this.options;
  }
}
