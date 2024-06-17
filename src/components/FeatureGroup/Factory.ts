import { FeatureGroup, LayerOptions, Util } from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface FeatureGroupOptions extends LayerOptions {}

interface AdditionalMethods
  extends Omit<BaseFactoryMethods<FeatureGroupOptions>, 'setInteractive'> {}

const validateOptions = (options: any): FeatureGroupOptions => {
  const keys: (keyof FeatureGroupOptions)[] = ['attribution', 'pane'];

  const validOptions = filterProperties<FeatureGroupOptions>({
    object: options,
    map: keys,
  });

  return validOptions as FeatureGroupOptions;
};

export default class FeatureGroupFactory
  extends FeatureGroup
  implements AdditionalMethods
{
  constructor(options: FeatureGroupOptions) {
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

  setOptions(newOptions: FeatureGroupOptions) {
    const validOptions = validateOptions(newOptions);

    Util.setOptions(this.options, validOptions);
  }
}
