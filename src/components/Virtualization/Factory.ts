import {
  DragEndEvent,
  Evented,
  LatLngBounds,
  Layer,
  LeafletEvent,
  Map,
  Marker,
} from 'leaflet';

import { filterProperties } from '@utils/functions';

export interface VirtualizationOptions {
  chunkSize?: number;
  chunkInterval?: number;
}

const validateOptions = (options: any): VirtualizationOptions => {
  const keys: (keyof VirtualizationOptions)[] = ['chunkInterval', 'chunkSize'];

  const validOptions = filterProperties<VirtualizationOptions>({
    object: options,
    map: keys,
  });

  return validOptions as VirtualizationOptions;
};

export default class Virtualization<C = any> extends Evented {
  private _layers: Layer[] = [];
  private _hidden_layers: Layer[] = [];
  private _map?: Map;
  private _container?: any | C;
  private _bounds?: LatLngBounds;
  private _chunkSize = 600;
  private _chunkInterval = 15;

  constructor(map: Map, container: C, options?: VirtualizationOptions) {
    const { chunkInterval, chunkSize } = validateOptions(options) || {};

    super();

    if (chunkInterval) {
      this._chunkInterval = chunkInterval;
    }

    if (chunkSize) {
      this._chunkSize = chunkSize;
    }

    this._initialize(map, container);
  }

  private async _processInChunks(
    layers: Layer[],
    action: (layers: Layer[]) => void,
    chunkSize: number,
    delay: number,
  ) {
    for (let i = 0; i < layers.length; i += chunkSize) {
      const chunk = layers.slice(i, i + chunkSize);
      action(chunk);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  private _hideLayers(bounds: LatLngBounds) {
    const hiddenLayers = this._layers.filter((layer: any) => {
      const position = layer.getLatLng();
      return !bounds.contains(position);
    });

    this._hidden_layers = this._hidden_layers.concat(hiddenLayers);

    if ((this as any)._container?.removeLayers) {
      this._processInChunks(
        hiddenLayers,
        layers => this._container.removeLayers(layers),
        this._chunkSize, // Chunk size
        this._chunkInterval, // Delay in ms
      );
    }
  }

  private _showLayers(bounds: LatLngBounds) {
    const visibleLayers = this._hidden_layers.filter((layer: any) => {
      const position = layer.getLatLng();
      return bounds.contains(position);
    });

    this._layers = this._layers.concat(visibleLayers);

    if ((this as any)._container?.addLayers) {
      this._processInChunks(
        visibleLayers,
        layers => this._container.addLayers(layers),
        this._chunkSize, // Chunk size
        this._chunkInterval, // Delay in ms
      );
    }
  }

  private _onDragEnd = (event: DragEndEvent) => {
    const { target } = event || {};

    const newBounds = (target as Map).getBounds();

    this._hideLayers(newBounds);
    this._showLayers(newBounds);
  };

  private _onZoomEnd = (event: LeafletEvent) => {
    const { target } = event || {};

    const newBounds = (target as Map).getBounds();

    this._hideLayers(newBounds);
    this._showLayers(newBounds);
  };

  private _initialize(map: Map, container: C) {
    const bounds = map?.getBounds();
    this._container = container;
    this._map = map;

    this._bounds = bounds;

    map?.on('dragend', this._onDragEnd);
    map?.on('zoomend', this._onZoomEnd);
  }

  public addLayer(layer: Layer) {
    const position = (layer as Marker)?.getLatLng();

    const isInBounds = this?._bounds?.contains(position);

    this.fireEvent('layeradd', { layer });

    if (isInBounds) {
      this._layers.push(layer);
      (this as any)._container?.addLayer(layer);
    } else {
      this._hidden_layers.push(layer);
    }
  }

  public removeLayer(layer: Layer) {
    this._container?.removeLayer(layer);
    this._layers = this._layers.filter(
      (item: any) => item._leaflet_id !== (layer as any)._leaflet_id,
    );

    this._hidden_layers = this._hidden_layers.filter(
      (item: any) => item._leaflet_id !== (layer as any)._leaflet_id,
    );
  }

  public clearLayers() {
    this._processInChunks(
      this._layers,
      layers =>
        layers.forEach(layer => {
          if (!this._map?.hasLayer(layer)) return;
          layer?.clearAllEventListeners();
          this._map?.removeLayer(layer);
        }),
      this._chunkSize, // Chunk size
      this._chunkInterval, // Delay in ms
    );
    this._layers = [];
    this._hidden_layers = [];
  }

  public getLayers() {
    return { visible: this._layers, hidden: this._hidden_layers };
  }

  public destroy() {
    this.clearLayers();
    this._map?.off('dragend', this._onDragEnd);
    this._map?.off('zoomend', this._onZoomEnd);
  }
}
