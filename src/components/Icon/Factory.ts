import { Icon, IconOptions as LeafletIconOptions, Util } from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export type ImageLoading = 'eager' | 'lazy';

export interface IconOptions extends LeafletIconOptions {
  imageLoading?: ImageLoading;
}

interface AdditionalMethods
  extends Omit<BaseFactoryMethods<IconOptions>, 'setInteractive'> {}

export const iconKeys: (keyof IconOptions)[] = [
  'attribution',
  'className',
  'crossOrigin',
  'iconAnchor',
  'iconRetinaUrl',
  'iconSize',
  'iconSize',
  'iconUrl',
  'imageLoading',
  'pane',
  'popupAnchor',
  'shadowAnchor',
  'shadowRetinaUrl',
  'shadowSize',
  'shadowUrl',
  'tooltipAnchor',
];

const validateOptions = (options: any): IconOptions => {
  const validOptions = filterProperties<IconOptions>({
    object: options,
    map: iconKeys,
  });

  return validOptions as IconOptions;
};

export default class IconFactory extends Icon implements AdditionalMethods {
  private _element?: HTMLImageElement;

  constructor(options: IconOptions) {
    const validOptions = validateOptions(options);

    super(validOptions);
  }

  private _createImg(src: string, el: HTMLImageElement) {
    const img = el || document.createElement('img');

    img.src = src;
    this._element = img;

    const { imageLoading } = (this?.options as IconOptions) || {};

    if (imageLoading) {
      img.loading = imageLoading;
    }

    return img;
  }

  createIcon(oldIcon?: HTMLElement) {
    return (this as any)?._createIcon('icon', oldIcon);
  }

  setImage(src: string): void {
    if (!this._element) return;

    this._element.src = src;
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  getNode(): HTMLElement {
    return this._element!;
  }

  getOptions(): IconOptions {
    return this.options;
  }

  setOptions(newOptions: IconOptions) {
    const validOptions = validateOptions(newOptions);

    Util.setOptions(this.options, validOptions);
  }
}
