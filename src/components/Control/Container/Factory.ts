import {
  Control as ControlFactory,
  ControlOptions as ControlFactoryOptions,
} from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';

export type Position = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

export interface ControlOptions extends ControlFactoryOptions {
  position: Position;
}

interface AdditionalMethods extends BaseFactoryMethods<ControlOptions> {}

const validateOptions = (options: any): ControlOptions => {
  const keys: (keyof ControlOptions)[] = ['position'];

  const validOptions = filterProperties<ControlOptions>({
    object: options,
    map: keys,
  });

  return validOptions as ControlOptions;
};

export default class Control
  extends ControlFactory
  implements AdditionalMethods
{
  private _element?: HTMLElement;

  constructor(element: HTMLElement, options: ControlOptions) {
    const validOptions = validateOptions(options);

    super(validOptions);

    this._element = element;
  }

  getLeafletId() {
    return (this as any)?._leaflet_id;
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
