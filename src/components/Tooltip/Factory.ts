import {
  Layer,
  Tooltip,
  TooltipOptions as LeafletTooltipOptions,
  Util,
  DomUtil,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface TooltipOptions extends LeafletTooltipOptions {}

interface AdditionalMethods extends BaseFactoryMethods<TooltipOptions> {}

export const tooltipKeys: (keyof TooltipOptions)[] = [
  'className',
  'direction',
  'interactive',
  'offset',
  'opacity',
  'pane',
  'permanent',
  'sticky',
];

const validateOptions = (options: any): TooltipOptions => {
  const validOptions = filterProperties<TooltipOptions>({
    object: options,
    map: tooltipKeys,
  });

  return validOptions as TooltipOptions;
};

export default class TooltipFactory
  extends Tooltip
  implements AdditionalMethods
{
  constructor(options: TooltipOptions, source: Layer) {
    const validOptions = validateOptions(options);

    super(validOptions, source);
  }

  getNode() {
    return this?.getElement();
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  setOptions(newOptions: TooltipOptions): void {
    const validOptions = validateOptions(newOptions);

    Util.setOptions(this.options, validOptions);
  }

  getOptions<TooltipOptions>(): TooltipOptions {
    return (this as any)?.options;
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
