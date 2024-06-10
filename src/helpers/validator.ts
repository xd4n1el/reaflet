import {
  DivIcon,
  FeatureGroup,
  Icon,
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

export const isTooltip = (element: any): element is Tooltip =>
  element instanceof Tooltip;

export const isPopup = (element: any): element is Popup =>
  element instanceof Popup;

export const isLayer = (element: any): element is Layer =>
  element instanceof Layer;

export const isMap = (element: any): element is Map => element instanceof Map;

export const isLayerGroup = (element: any): element is LayerGroup =>
  element instanceof LayerGroup;

export const isIcon = (element: any): element is Icon =>
  element instanceof Icon;

export const isDivIcon = (element: any): element is DivIcon =>
  element instanceof DivIcon;

export const isMarkerClusterGroup = (
  element: any,
): element is MarkerClusterGroup => element instanceof MarkerClusterGroup;

export const isFeatureGroup = (element: any): element is FeatureGroup =>
  element instanceof FeatureGroup;

export const getElementInstanceType = (
  element: any,
): ElementTypeName | undefined => {
  const types: Type[] = [
    // { check: isMarkerClusterGroup, name: 'cluster' },
    { check: isMap, name: 'map' },
    { check: isLayer, name: 'layer' },
    { check: isLayerGroup, name: 'layer-group' },
    { check: isFeatureGroup, name: 'feature-group' },
    { check: isPopup, name: 'popup' },
    { check: isTooltip, name: 'tooltip' },
    { check: isDivIcon, name: 'div-icon' },
    { check: isIcon, name: 'icon' },
  ];

  for (const { check, name } of types) {
    if (check(element)) return name;
  }
};
