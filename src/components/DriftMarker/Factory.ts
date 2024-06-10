import { LatLngExpression, MarkerOptions } from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';
import DriftMarkerFactory, { SlideOptions } from '@utils/classes/DriftMarker';

export type SlideToOptions = SlideOptions;

export interface DriftMarkerOptions<D = any>
  extends MarkerOptions,
    Omit<SlideToOptions, 'rotationOrigin'> {
  data?: D;
}

interface AdditionalMethods<D = any>
  extends BaseFactoryMethods<DriftMarkerOptions> {
  setData?: (newData: D) => void;
  getData?: () => D | undefined;
}

const validateOptions = (options: any): DriftMarkerOptions => {
  const keys: (keyof DriftMarkerOptions)[] = [
    'alt',
    'attribution',
    'autoPan',
    'autoPanOnFocus',
    'autoPanPadding',
    'autoPanSpeed',
    'bubblingMouseEvents',
    'draggable',
    'interactive',
    'keyboard',
    'opacity',
    'pane',
    'riseOffset',
    'riseOnHover',
    'shadowPane',
    'title',
    'zIndexOffset',
    'keepAtCenter',
    'duration',
  ];

  const validOptions = filterProperties<DriftMarkerOptions>({
    object: options,
    map: keys,
  });

  return validOptions as DriftMarkerOptions;
};

export default class DriftMarker<D = any>
  extends DriftMarkerFactory
  implements AdditionalMethods<D>
{
  private data?: D;

  constructor(position: LatLngExpression, options?: DriftMarkerOptions) {
    const validOptions = validateOptions(options);

    const { data, ...rest } = validOptions || {};

    super(position, rest);

    this.data = data;
  }

  getLeafletId(): number | undefined {
    return (this as any)?._leaflet_id;
  }

  getNode(): HTMLElement | undefined {
    return this.getElement();
  }

  setOptions(newOptions: DriftMarkerOptions): void {
    const validOptions = validateOptions(newOptions);

    Object.assign(this.options, validOptions);
  }

  getOptions<DriftMarkerOptions>(): DriftMarkerOptions {
    return (this as any)?.options;
  }

  getData(): D | undefined {
    return this.data;
  }

  setData(newData: D) {
    if (!Array.isArray(newData)) {
      this.data = newData;
    } else if (typeof newData === 'object') {
      Object.assign(this.options, newData);
    }

    (this as any).update();
  }
}
