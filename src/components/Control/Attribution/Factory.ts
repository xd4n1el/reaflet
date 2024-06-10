import { BaseFactoryMethods } from '@/utils/interfaces';
import { Control, Util } from 'leaflet';

export interface AttributionControlOptions extends Control.AttributionOptions {}

interface AdditionalMethods extends BaseFactoryMethods {}

export default class AttributionControl
  extends Control.Attribution
  implements AdditionalMethods
{
  constructor(options: AttributionControlOptions) {
    super(options);
  }

  getLeafletId() {
    return (this as any)?._leaflet_id;
  }

  getNode() {
    return this.getContainer();
  }

  getOptions() {
    return this.options;
  }

  setOptions(newOptions: AttributionControlOptions) {
    Util.setOptions(this.options, newOptions);
  }
}
