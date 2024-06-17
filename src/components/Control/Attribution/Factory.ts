import { Control, Util } from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface AttributionControlOptions extends Control.AttributionOptions {}

interface AdditionalMethods extends BaseFactoryMethods {}

export const AttributionControlKeys: (keyof AttributionControlOptions)[] = [
  'position',
];

const validateOptions = (options: any): AttributionControlOptions => {
  const validOptions = filterProperties<AttributionControlOptions>({
    object: options,
    map: AttributionControlKeys,
  });

  return validOptions as AttributionControlOptions;
};

export default class AttributionControlFactory
  extends Control.Attribution
  implements AdditionalMethods
{
  constructor(options: AttributionControlOptions) {
    const validOptions = validateOptions(options);

    super({ ...validOptions, prefix: false });
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  getNode() {
    return this?.getContainer();
  }

  getOptions() {
    return this?.options;
  }

  setOptions(newOptions: AttributionControlOptions) {
    const validOptions = validateOptions(newOptions);

    Util.setOptions(this.options, validOptions);
  }
}
