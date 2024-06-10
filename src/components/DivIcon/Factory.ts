import {
  point,
  DivIcon as DivIconFactory,
  DivIconOptions as DivIconFactoryOptions,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface DivIconOptions extends DivIconFactoryOptions {}

interface AdditionalMethods extends BaseFactoryMethods<DivIconOptions> {
  createIcon: (oldIcon?: HTMLElement) => HTMLElement | undefined;
}

const validateOptions = (options: any): DivIconOptions => {
  const keys: (keyof DivIconOptions)[] = [
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

  const validOptions = filterProperties<DivIconOptions>({
    object: options,
    map: keys,
  });

  return validOptions as DivIconOptions;
};

export default class DivIcon
  extends DivIconFactory
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

  getNode(): HTMLElement {
    return this._element!;
  }

  createIcon(oldIcon?: HTMLElement): HTMLElement {
    if (oldIcon) return this.buildIcon(oldIcon);

    return this._element!;
  }

  getLeafletId() {
    return (this as any)._leaflet_id;
  }

  setOptions(newOptions: any) {
    const validOptions = validateOptions(newOptions);

    Object.assign(this.options, validOptions);
  }

  getOptions(): DivIconOptions {
    return this.options;
  }
}
