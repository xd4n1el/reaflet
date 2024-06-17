import {
  point,
  DivIcon,
  DivIconOptions as DivIconFactoryOptions,
  Util,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface DivIconOptions extends DivIconFactoryOptions {}

interface AdditionalMethods
  extends Omit<BaseFactoryMethods<DivIconOptions>, 'setInteractive'> {
  createIcon: (oldIcon?: HTMLElement) => HTMLElement | undefined;
}

export const divIconKeys: (keyof DivIconOptions)[] = [
  'attribution',
  'bgPos',
  'className',
  'iconAnchor',
  'iconRetinaUrl',
  'iconSize',
  'iconUrl',
  'pane',
  'popupAnchor',
  'shadowAnchor',
  'shadowRetinaUrl',
  'shadowUrl',
  'tooltipAnchor',
];

const validateOptions = (options: any): DivIconOptions => {
  const validOptions = filterProperties<DivIconOptions>({
    object: options,
    map: divIconKeys,
  });

  return validOptions as DivIconOptions;
};

export default class DivIconFactory
  extends DivIcon
  implements AdditionalMethods
{
  private _element?: HTMLElement;

  constructor(options: DivIconOptions) {
    const validOptions = validateOptions(options);

    super(validOptions);

    this.buildIcon();
  }

  buildIcon(oldIcon?: HTMLElement) {
    const { options } = this || {};

    const div =
      oldIcon?.tagName === 'DIV' ? oldIcon : document.createElement('div');

    if (options?.bgPos) {
      const bgPos = point(options?.bgPos);

      div.style.backgroundPosition = `${-bgPos?.x}px ${-bgPos?.y}px`;
    }

    div.style.width = 'fit-content';
    div.style.height = 'fit-content';

    (this as any)?._setIconStyles(div, 'icon');

    this._element = div;

    return div;
  }

  createIcon(oldIcon?: HTMLElement): HTMLElement {
    if (oldIcon) return this.buildIcon(oldIcon);

    return this._element!;
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  getNode(): HTMLElement {
    return this._element!;
  }

  getOptions(): DivIconOptions {
    return this.options;
  }

  setOptions(newOptions: any) {
    const validOptions = validateOptions(newOptions);

    Util.setOptions(this.options, validOptions);
  }
}
