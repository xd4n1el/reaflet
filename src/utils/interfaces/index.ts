import { LeafletEvent } from 'leaflet';

export interface InternalComponentProps<T = any> {
  container?: T;
  insertMode?: 'default' | 'custom';
}

export interface GetLeafletIdentifier {
  getLeafletId: () => number | undefined;
}

export interface GetElementContainer {
  getNode: () => HTMLElement | undefined;
}

export interface BaseFactoryMethods<O = any> {
  getLeafletId: () => number | undefined;
  getNode: () => HTMLElement | undefined;
  setOptions: (newOptions: O) => void;
  getOptions: () => O;
  setInteractive?: (interactive: boolean) => void;
}

export interface AddChildrenEvent<C = any> extends LeafletEvent {
  elements?: C | C[];
}
