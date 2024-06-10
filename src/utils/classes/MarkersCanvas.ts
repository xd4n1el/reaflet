// Inspired by leaflet-markers-canvas, all credits for the creators.
// original repo: https://github.com/francoisromain/leaflet-markers-canvas

import L, { Browser, Layer, LayerOptions, Map, Util } from 'leaflet';
import RBush from 'rbush';

export default class MarkersCanvas extends Layer {
  protected _map: Map;
  private _canvas: HTMLCanvasElement | null = null;
  private _context: any = null;
  private _markers: any[] = [];
  private _markersTree: RBush<any> = new RBush();
  private _positionsTree: RBush<any> = new RBush();
  private _icons: any = {};

  constructor(options?: LayerOptions) {
    super(options);
    this._map = null as any;
  }

  addTo(map: Map) {
    map.addLayer(this as any);

    return this;
  }

  getBounds() {
    const bounds = new L.LatLngBounds([]);

    this._markers.forEach(marker => {
      bounds.extend(marker.getLatLng());
    });

    return bounds;
  }

  redraw() {
    this._redraw(true);
  }

  clear() {
    this._positionsTree = new RBush();
    this._markersTree = new RBush();
    this._markers = [];
    this._redraw(true);
  }

  addMarker(marker: any) {
    const { markerBox, positionBox, isVisible } = this._addMarker(marker);

    if (markerBox && isVisible) {
      this._markersTree.insert(markerBox);
    }

    if (positionBox) {
      this._positionsTree.insert(positionBox);
    }
  }

  addMarkers(markers: any[]) {
    const markerBoxes: any[] = [];
    const positionBoxes: any[] = [];

    markers.forEach(marker => {
      const { markerBox, positionBox, isVisible } = this._addMarker(marker);

      if (markerBox && isVisible) {
        markerBoxes.push(markerBox);
      }

      if (positionBox) {
        positionBoxes.push(positionBox);
      }
    });

    this._markersTree.load(markerBoxes);
    this._positionsTree.load(positionBoxes);
  }

  removeMarker(marker: any) {
    const latLng = marker.getLatLng();
    const isVisible = this?._map?.getBounds().contains(latLng);

    const positionBox = {
      minX: latLng.lng,
      minY: latLng.lat,
      maxX: latLng.lng,
      maxY: latLng.lat,
      marker,
    };

    this._positionsTree.remove(positionBox, (a: any, b: any) => {
      return a?.marker?._leaflet_id === b?.marker?._leaflet_id;
    });

    if (isVisible) {
      this._redraw(true);
    }
  }

  removeMarkers(markers: any[]) {
    let hasChanged = false;

    markers.forEach(marker => {
      const latLng = marker.getLatLng();
      const isVisible = this?._map?.getBounds().contains(latLng);

      const positionBox = {
        minX: latLng.lng,
        minY: latLng.lat,
        maxX: latLng.lng,
        maxY: latLng.lat,
        marker,
      };

      this._positionsTree.remove(positionBox, (a: any, b: any) => {
        return a?.marker?._leaflet_id === b?.marker?._leaflet_id;
      });

      if (isVisible) {
        hasChanged = true;
      }
    });

    if (hasChanged) {
      this._redraw(true);
    }
  }

  initialize(options: LayerOptions) {
    L.Util.setOptions(this, options);
  }

  onAdd(map: Map) {
    this._map = map;
    this._initCanvas();
    this?.getPane()?.appendChild((this as any)._canvas);

    map.on('moveend', this._reset, this);
    map.on('resize', this._reset, this);

    map.on('click', this._fire, this);
    map.on('mousemove', this._fire, this);

    if ((map as any)._zoomAnimated) {
      map.on('zoomanim', this._animateZoom, this);
    }

    return this;
  }

  onRemove(map: Map) {
    this?.getPane()?.removeChild((this as any)._canvas);

    map?.off('click', this._fire, this);
    map?.off('mousemove', this._fire, this);
    map?.off('moveend', this._reset, this);
    map?.off('resize', this._reset, this);

    if ((map as any)._zoomAnimated) {
      map.off('zoomanim', this._animateZoom, this);
    }

    return this;
  }

  setOptions(options: LayerOptions) {
    Util.setOptions(this, options);

    return this.redraw();
  }

  _initCanvas() {
    const { x, y } = this?._map?.getSize() as any;
    const isAnimated = this?._map?.options.zoomAnimation && Browser.any3d;

    this._canvas = L.DomUtil.create(
      'canvas',
      'leaflet-markers-canvas-layer leaflet-layer',
    );
    this._canvas.width = x;
    this._canvas.height = y;
    this._context = this._canvas.getContext('2d');

    L.DomUtil.addClass(
      this._canvas,
      `leaflet-zoom-${isAnimated ? 'animated' : 'hide'}`,
    );
  }

  _addMarker(marker: any) {
    if (marker.options.pane !== 'markerPane' || !marker.options.icon) {
      return { markerBox: null, positionBox: null, isVisible: null };
    }

    marker._map = this?._map;

    L.Util.stamp(marker);

    const latLng = marker.getLatLng();
    const isVisible = this?._map.getBounds().contains(latLng);
    const { x, y } = this._map.latLngToContainerPoint(latLng);
    const { iconSize, iconAnchor } = marker.options.icon.options;

    const markerBox = {
      minX: x - iconAnchor[0],
      minY: y - iconAnchor[1],
      maxX: x + iconSize[0] - iconAnchor[0],
      maxY: y + iconSize[1] - iconAnchor[1],
      marker,
    };

    const positionBox = {
      minX: latLng.lng,
      minY: latLng.lat,
      maxX: latLng.lng,
      maxY: latLng.lat,
      marker,
    };

    if (isVisible) {
      this._drawMarker(marker, { x, y });
    }

    this._markers.push(marker);

    return { markerBox, positionBox, isVisible };
  }

  _drawMarker(marker: any, { x, y }: any) {
    const { iconUrl } = marker.options.icon.options;

    if (marker.image) {
      if (marker.image.complete && marker.image.naturalWidth !== 0) {
        this._drawImage(marker, { x, y });
      }
    } else if (this._icons[iconUrl]) {
      marker.image = this._icons[iconUrl].image;

      if (this._icons[iconUrl].isLoaded) {
        this._drawImage(marker, { x, y });
      } else {
        this._icons[iconUrl].elements.push({ marker, x, y });
      }
    } else {
      const image = new Image();
      image.src = iconUrl;
      marker.image = image;

      this._icons[iconUrl] = {
        image,
        isLoaded: false,
        elements: [{ marker, x, y }],
      };

      image.onload = () => {
        this._icons[iconUrl].isLoaded = true;
        this._icons[iconUrl].elements.forEach(({ marker, x, y }: any) => {
          this._drawImage(marker, { x, y });
        });
      };

      image.onerror = () => {
        return;
      };
    }
  }

  _drawImage(marker: any, { x, y }: any) {
    const { rotationAngle, iconAnchor, iconSize } = marker.options.icon.options;
    const angle = rotationAngle || 0;
    const image: HTMLImageElement = marker?.image;

    const [ax, ay] = iconAnchor;
    const [width, height] = iconSize;

    this._context.save();
    this._context.translate(x, y);
    this._context.rotate((angle * Math.PI) / 180);
    this._context.drawImage(image, -ax, -ay, width, height);
    this._context.restore();
  }

  _redraw(clear?: boolean) {
    if (clear) {
      this._context.clearRect(
        0,
        0,
        this?._canvas?.width,
        this?._canvas?.height,
      );
    }

    if (!this._map || !this._positionsTree) return;

    const mapBounds = this._map.getBounds();
    const mapBoundsBox = {
      minX: mapBounds.getWest(),
      minY: mapBounds.getSouth(),
      maxX: mapBounds.getEast(),
      maxY: mapBounds.getNorth(),
    };

    const markers: any[] = [];
    this._positionsTree.search(mapBoundsBox).forEach(({ marker }) => {
      const latLng = marker.getLatLng();
      const { x, y } = (this as any)._map.latLngToContainerPoint(latLng);
      const { iconSize, iconAnchor } = marker.options.icon.options;

      const markerBox = {
        minX: x - iconAnchor[0],
        minY: y - iconAnchor[1],
        maxX: x + iconSize[0] - iconAnchor[0],
        maxY: y + iconSize[1] - iconAnchor[1],
        marker,
      };

      markers.push(markerBox);
      this._drawMarker(marker, { x, y });
    });

    this._markersTree.clear();
    this._markersTree.load(markers);
  }

  _reset() {
    const topLeft = (this as any)._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition((this as any)._canvas, topLeft);

    const { x, y } = (this as any)._map.getSize();
    this._canvas!.width = x;
    this._canvas!.height = y;

    this._redraw();
  }

  _fire(event: any) {
    if (!this._markersTree) return;

    const { x, y } = event.containerPoint;
    const markers = this._markersTree.search({
      minX: x,
      minY: y,
      maxX: x,
      maxY: y,
    });

    if (markers && markers.length) {
      (this as any)._map._container.style.cursor = 'pointer';
      const marker = markers[0].marker;

      if (event.type === 'click') {
        if (marker.listens('click')) {
          marker.fire('click');
        }
      }

      if (event.type === 'mousemove') {
        if (
          (this as any)._mouseOverMarker &&
          (this as any)._mouseOverMarker !== marker
        ) {
          if ((this as any)._mouseOverMarker.listens('mouseout')) {
            (this as any)._mouseOverMarker.fire('mouseout');
          }
        }

        if (
          !(this as any)._mouseOverMarker ||
          (this as any)._mouseOverMarker !== marker
        ) {
          (this as any)._mouseOverMarker = marker;
          if (marker.listens('mouseover')) {
            marker.fire('mouseover');
          }
        }
      }
    } else {
      (this as any)._map._container.style.cursor = '';
      if (event.type === 'mousemove' && (this as any)._mouseOverMarker) {
        if ((this as any)._mouseOverMarker.listens('mouseout')) {
          (this as any)._mouseOverMarker.fire('mouseout');
        }

        delete (this as any)._mouseOverMarker;
      }
    }
  }

  _animateZoom(event: any) {
    const scale = (this as any)._map.getZoomScale(event.zoom);
    const offset = (this as any)._map._latLngBoundsToNewLayerBounds(
      (this as any)._map.getBounds(),
      event.zoom,
      event.center,
    ).min;

    L.DomUtil.setTransform((this as any)._canvas, offset, scale);
  }
}
