import { LayerGroup, LayerOptions, Util } from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface LayerGroupOptions extends LayerOptions {}

interface AdditionalMethods
  extends Omit<BaseFactoryMethods<LayerGroupOptions>, 'setInteractive'> {}

export const layerGroupKeys: (keyof LayerGroupOptions)[] = [
  'attribution',
  'pane',
];

const validateOptions = (options: any): LayerGroupOptions => {
  const validOptions = filterProperties<LayerGroupOptions>({
    object: options,
    map: layerGroupKeys,
  });

  return validOptions as LayerGroupOptions;
};

export default class LayerGroupFactory
  extends LayerGroup
  implements AdditionalMethods
{
  constructor(options: LayerOptions) {
    const validOptions = validateOptions(options);

    super(undefined, validOptions);
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  getNode() {
    return this?._map?.getContainer();
  }

  getOptions() {
    return this?.options;
  }

  setOptions(newOptions: LayerGroupOptions) {
    const validOptions = validateOptions(newOptions);

    Util.setOptions(this.options, validOptions);
  }
}
