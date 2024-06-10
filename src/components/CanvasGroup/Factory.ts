import L, { Layer, LayerOptions, Map } from 'leaflet';

import { BaseFactoryMethods } from '@utils/interfaces';
import MarkersCanvasFactory from '@utils/classes/MarkersCanvas';

interface AdditionalMethods extends BaseFactoryMethods {
  addTo?: (map: Map) => void;
  clear?: () => void;
  redraw?: () => void;
  getBounds?: () => void;
  addLayer: (layer: Layer) => void;
  addLayers: (layers: Layer[]) => void;
  removeLayer: (layer: Layer) => void;
  removeLayers: (layer: Layer[]) => void;
}

export default class CanvasGroup
  extends MarkersCanvasFactory
  implements AdditionalMethods
{
  constructor(options?: LayerOptions) {
    super(options);
  }

  getLeafletId(): number | undefined {
    return (this as any)?._leaflet_id;
  }

  getNode(): HTMLElement | undefined {
    return;
  }

  getOptions() {
    return;
  }

  setOptions(newOptions: LayerOptions) {
    Object.assign(this.options, newOptions);
  }

  addLayer(layer: Layer): void {
    this.addMarker(layer);
  }

  addLayers(layers: Layer[]): void {
    this.addMarkers(layers);
  }

  removeLayer(layer: L.Layer): void {
    this.removeMarker(layer);
  }

  removeLayers(layers: Layer[]): void {
    this.removeMarkers(layers);
  }
}
