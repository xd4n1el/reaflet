import {
  Control,
  ControlOptions as LeafletControlOptions,
  Util,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export type Position = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

export interface ControlOptions extends LeafletControlOptions {
  position: Position;
}

interface AdditionalMethods extends BaseFactoryMethods<ControlOptions> {}

export const controlKeys: (keyof ControlOptions)[] = ['position'];

const validateOptions = (options: any): ControlOptions => {
  const validOptions = filterProperties<ControlOptions>({
    object: options,
    map: controlKeys,
  });

  return validOptions as ControlOptions;
};

export default class ControlFactory
  extends Control
  implements AdditionalMethods
{
  private _element?: HTMLElement;

  constructor(element: HTMLElement, options: ControlOptions) {
    const validOptions = validateOptions(options);

    super(validOptions);

    this._element = element;
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  getNode() {
    return this?.getContainer();
  }

  getOptions() {
    return this.options as any;
  }

  setOptions(newOptions: ControlOptions) {
    const validOptions = validateOptions(newOptions);

    Object.assign(this.options, validOptions);
  }

  onAdd(): HTMLElement {
    if (!this._element) {
      throw new Error('Container to control not provided.');
    }

    const container = this._element;

    const classes = Array.from(container?.classList as any);
    classes.push('leaflet-bar');
    classes.push('leaflet-control-container');

    container?.setAttribute('class', classes.join(' '));

    return container!;
  }
}
