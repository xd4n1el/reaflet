import {
  Icon as IconFactory,
  IconOptions as IconFactoryOptions,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export type ImageLoading = 'eager' | 'lazy';

export interface IconOptions extends IconFactoryOptions {
  imageLoading?: ImageLoading;
}

interface AdditionalMethods extends BaseFactoryMethods<IconOptions> {}

const validateOptions = (options: any): IconOptions => {
  const keys: (keyof IconOptions)[] = [
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

  const validOptions = filterProperties<IconOptions>({
    object: options,
    map: keys,
  });

  return validOptions as IconOptions;
};

export default class Icon extends IconFactory implements AdditionalMethods {
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

  getNode(): HTMLElement {
    return this._element!;
  }

  setImage(src: string): void {
    if (!this._element) return;

    this._element.src = src;
  }

  getLeafletId() {
    return (this as any)._leaflet_id;
  }

  setOptions(newOptions: IconOptions) {
    const validOptions = validateOptions(newOptions);

    Object.assign(this.options, validOptions);
  }

  getOptions(): IconOptions {
    return this.options;
  }
}
