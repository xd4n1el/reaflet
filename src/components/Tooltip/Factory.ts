import {
  Layer,
  Tooltip as TooltipFactory,
  TooltipOptions as TooltipFactoryOptions,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface TooltipOptions extends TooltipFactoryOptions {}

interface AdditionalMethods extends BaseFactoryMethods<TooltipOptions> {}

const validateOptions = (options: any): TooltipOptions => {
  const keys: (keyof TooltipOptions)[] = [
    'className',
    'direction',
    'interactive',
    'offset',
    'opacity',
    'pane',
    'permanent',
    'sticky',
  ];

  const validOptions = filterProperties<TooltipOptions>({
    object: options,
    map: keys,
  });

  return validOptions as TooltipOptions;
};

export default class Tooltip
  extends TooltipFactory
  implements AdditionalMethods
{
  constructor(options: TooltipOptions, source: Layer) {
    const validOptions = validateOptions(options);

    super(validOptions, source);
  }

  getNode(): HTMLElement | undefined {
    return this?.getElement();
  }

  getLeafletId() {
    return (this as any)?._leaflet_id;
  }

  setOptions(newOptions: TooltipOptions): void {
    const validOptions = validateOptions(newOptions);

    Object.assign(this.options, validOptions);

    (this as any).update();
  }

  getOptions<TooltipOptions>(): TooltipOptions {
    return (this as any)?.options;
  }
}
