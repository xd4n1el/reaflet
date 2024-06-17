import { Layer, LayerOptions, Map, Util } from 'leaflet';

import { filterProperties } from '@utils/functions';
import { BaseFactoryMethods } from '@utils/interfaces';
import MarkersCanvasFactory from '@utils/classes/MarkersCanvas';

export interface CanvasGroupOptions {}

interface AdditionalMethods
  extends Omit<BaseFactoryMethods<any>, 'setInteractive'> {
  addTo?: (map: Map) => void;
  clear?: () => void;
  redraw?: () => void;
  getBounds?: () => void;
  addLayer: (layer: Layer) => void;
  addLayers: (layers: Layer[]) => void;
  removeLayer: (layer: Layer) => void;
  removeLayers: (layer: Layer[]) => void;
}

export const canvasGroupKeys: (keyof CanvasGroupOptions)[] = [];

const validateOptions = (options: any): CanvasGroupOptions => {
  const validOptions = filterProperties<CanvasGroupOptions>({
    object: options,
    map: canvasGroupKeys,
  });

  return validOptions as CanvasGroupOptions;
};

export default class CanvasGroupFactory
  extends MarkersCanvasFactory
  implements AdditionalMethods
{
  constructor(options?: LayerOptions) {
    const validOptions = validateOptions(options);

    super(validOptions);
  }

  getLeafletId() {
    return Util.stamp(this);
  }

  getNode(): HTMLElement | undefined {
    return this._map.getContainer();
  }

  getOptions() {
    return this?.options;
  }

  setOptions(newOptions: LayerOptions) {
    const validOptions = validateOptions(newOptions);

    Util.setOptions(this.options, validOptions);
  }

  addLayer(layer: Layer): void {
    this.addMarker(layer);
  }

  addLayers(layers: Layer[]): void {
    this.addMarkers(layers);
  }

  removeLayer(layer: Layer): void {
    this.removeMarker(layer);
  }

  removeLayers(layers: Layer[]): void {
    this.removeMarkers(layers);
  }
}
