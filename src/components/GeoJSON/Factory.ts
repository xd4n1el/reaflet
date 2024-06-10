import { GeoJsonObject } from 'geojson';
import { GeoJSON as GeoJSONFactory, GeoJSONOptions } from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export type { GeoJSONOptions };

interface AdditionalMethods extends BaseFactoryMethods {}

const validateOptions = (options: any): GeoJSONOptions => {
  const keys: (keyof GeoJSONOptions)[] = [
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

  const validOptions = filterProperties<GeoJSONOptions>({
    object: options,
    map: keys,
  });

  return validOptions as GeoJSONOptions;
};

export default class GeoJSON
  extends GeoJSONFactory
  implements AdditionalMethods
{
  constructor(geojson: GeoJsonObject, options?: GeoJSONOptions) {
    const validOptions = validateOptions(options);

    super(geojson, validOptions);
  }

  getNode() {
    return this as any;
  }

  getLeafletId() {
    return (this as any)?._leaflet_id;
  }

  getOptions() {
    return this.options;
  }

  setOptions(newOptions: GeoJSONOptions) {
    const validOptions = validateOptions(newOptions);

    Object.assign(this.options, validOptions);
  }
}
