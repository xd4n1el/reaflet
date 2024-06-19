import { GeoJsonObject } from 'geojson';
import {
  DomUtil,
  GeoJSON,
  GeoJSONOptions as LeafletGeoJSONOptions,
  Util,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface GeoJSONOptions extends LeafletGeoJSONOptions {}

interface AdditionalMethods extends BaseFactoryMethods {}

export const geoJSONKeys: (keyof GeoJSONOptions)[] = [
  'attribution',
  'bubblingMouseEvents',
  'coordsToLatLng',
  'filter',
  'interactive',
  'markersInheritOptions',
  'pane',
  'pointToLayer',
  'style',
];

const validateOptions = (options: any): GeoJSONOptions => {
  const validOptions = filterProperties<GeoJSONOptions>({
    object: options,
    map: geoJSONKeys,
  });

  return validOptions as GeoJSONOptions;
};

export default class GeoJSONFactory
  extends GeoJSON
  implements AdditionalMethods
{
  constructor(geojson: GeoJsonObject, options?: GeoJSONOptions) {
    const validOptions = validateOptions(options);

    super(geojson, validOptions);
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  getNode() {
    return undefined;
  }

  getOptions() {
    return this.options;
  }

  setOptions(newOptions: GeoJSONOptions) {
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
