import {
  DivIcon,
  FeatureGroup,
  Icon,
  LatLngExpression,
  Layer,
  LayerGroup,
  Map,
  MarkerClusterGroup,
  Popup,
  Tooltip,
} from 'leaflet';

export type ElementTypeName =
  | 'map'
  | 'layer'
  | 'cluster'
  | 'layer-group'
  | 'feature-group'
  | 'popup'
  | 'tooltip'
  | 'icon'
  | 'div-icon';

export interface Type {
  check: (element: any) => boolean;
  name: ElementTypeName;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface FullCoordinate {
  latitude: number;
  longitude: number;
}

type Position =
  | number[]
  | { lat: number; lng: number }
  | { latitude: number; longitude: number };

export default class Validator {
  private isValidLatLng(lat: number, lng: number): boolean {
    return (
      typeof lat === 'number' &&
      lat >= -90 &&
      lat <= 90 &&
      typeof lng === 'number' &&
      lng >= -180 &&
      lng <= 180
    );
  }

  private toLatLng(position: LatLngExpression): Coordinates | null {
    if (Array.isArray(position) && position.length === 2) {
      const [lat, lng] = position;

      if (typeof lat === 'number' && typeof lng === 'number') {
        return { lat: position[0], lng: position[1] };
      }
    } else if ('lat' in position && 'lng' in position) {
      const { lat, lng } = (position as Coordinates) || {};

      return { lat, lng };
    } else if ('latitude' in position && 'longitude' in position) {
      const { latitude, longitude } = (position as FullCoordinate) || {};

      return { lat: latitude, lng: longitude };
    }

    return null;
  }

  isValidPosition(position: Position): boolean {
    const coordinate =
      this.toLatLng(position as LatLngExpression) || ({} as Coordinates);

    if (!coordinate) return false;

    return this.isValidLatLng(coordinate?.lat, coordinate?.lng);
  }

  hasMoved(previous: LatLngExpression, next: LatLngExpression): boolean {
    const prevLatLng = this.toLatLng(previous);
    const nextLatLng = this.toLatLng(next);

    if (!prevLatLng || !nextLatLng) return false;

    return (
      prevLatLng.lat !== nextLatLng.lat || prevLatLng.lng !== nextLatLng.lng
    );
  }

  isTooltip(element: any): element is Tooltip {
    return element instanceof Tooltip;
  }

  isPopup(element: any): element is Popup {
    return element instanceof Popup;
  }

  isLayer(element: any): element is Layer {
    return element instanceof Layer;
  }

  isMap(element: any): element is Map {
    return element instanceof Map;
  }

  isLayerGroup(element: any): element is LayerGroup {
    return element instanceof LayerGroup;
  }

  isIcon(element: any): element is Icon {
    return element instanceof Icon;
  }

  isDivIcon(element: any): element is DivIcon {
    return element instanceof DivIcon;
  }

  isMarkerClusterGroup(element: any): element is MarkerClusterGroup {
    return element instanceof MarkerClusterGroup;
  }

  isFeatureGroup(element: any): element is FeatureGroup {
    return element instanceof FeatureGroup;
  }

  getElementInstanceType(element: any): ElementTypeName | undefined {
    // order matters because all is a Layer extension
    const types: Type[] = [
      // { check: isMarkerClusterGroup, name: 'cluster' },
      { check: this.isMap, name: 'map' },
      { check: this.isLayerGroup, name: 'layer-group' },
      { check: this.isFeatureGroup, name: 'feature-group' },
      { check: this.isLayer, name: 'layer' },
      { check: this.isPopup, name: 'popup' },
      { check: this.isTooltip, name: 'tooltip' },
      { check: this.isDivIcon, name: 'div-icon' },
      { check: this.isIcon, name: 'icon' },
    ];

    for (const { check, name } of types) {
      if (check(element)) return name;
    }
  }
}
