import {
  LatLngExpression,
  Popup as PopupFactory,
  PopupOptions as PopupFactoryOptions,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface PopupOptions extends PopupFactoryOptions {}

interface AdditionalMethods extends BaseFactoryMethods<PopupOptions> {}

const validateOptions = (options: any): PopupOptions => {
  const keys: (keyof PopupOptions)[] = [
    'autoClose',
    'autoPan',
    'autoPanPadding',
    'autoPanPaddingBottomRight',
    'autoPanPaddingTopLeft',
    'className',
    'closeButton',
    'closeOnClick',
    'closeOnEscapeKey',
    'interactive',
    'keepInView',
    'maxHeight',
    'maxWidth',
    'offset',
    'pane',
  ];

  const validOptions = filterProperties<PopupOptions>({
    object: options,
    map: keys,
  });

  return validOptions as PopupOptions;
};

export default class Popup extends PopupFactory implements AdditionalMethods {
  constructor(position: LatLngExpression, options: PopupOptions) {
    const validOptions = validateOptions(options);

    super(position, validOptions);
  }

  getNode(): HTMLElement | undefined {
    return (this as any).getElement()?.firstChild;
  }

  getLeafletId() {
    return (this as any)._leaflet_id;
  }

  setOptions(newOptions: any) {
    const validOptions = validateOptions(newOptions);

    Object.assign(this.options, validOptions);

    this.update();
  }

  getOptions() {
    return this.options;
  }
}
