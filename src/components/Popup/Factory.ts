import {
  Popup,
  PopupOptions as LeafletPopupOptions,
  Util,
  DomUtil,
  Layer,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export interface PopupOptions extends LeafletPopupOptions {}

interface AdditionalMethods extends BaseFactoryMethods<PopupOptions> {}

export const popupKeys: (keyof PopupOptions)[] = [
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

const validateOptions = (options: any): PopupOptions => {
  const validOptions = filterProperties<PopupOptions>({
    object: options,
    map: popupKeys,
  });

  return validOptions as PopupOptions;
};

export default class PopupFactory extends Popup implements AdditionalMethods {
  constructor(options: PopupOptions, source?: Layer) {
    const validOptions = validateOptions(options);

    super(validOptions, source);
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  getNode(): HTMLElement | undefined {
    return (this as any).getElement()?.firstChild;
  }

  getOptions() {
    return this?.options;
  }

  setOptions(newOptions: any) {
    const validOptions = validateOptions(newOptions);

    Util.setOptions(this.options, validOptions);
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
