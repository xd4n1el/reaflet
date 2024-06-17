import { useEffect, useRef } from 'react';

import {
  LayerEvent,
  LayerGroup,
  Layer as LeafletLayer,
  LeafletEventHandlerFnMap,
  LeafletEvent,
  LayersControlEvent,
  LeafletMouseEvent,
  DragEndEvent,
  LeafletKeyboardEvent,
  ErrorEvent,
  LocationEvent,
  PopupEvent,
  ResizeEvent,
  MarkerClusterSpiderfyEvent,
  TileEvent,
  TileErrorEvent,
  TooltipEvent,
  ZoomAnimEvent,
  Map,
  Tooltip,
  Popup,
} from 'leaflet';

type Layer = LeafletLayer | LayerGroup;

interface Event {
  event: keyof LeafletEventHandlerFnMap;
  handler?: (event: any) => void;
}

interface Props extends EventHandlers {
  [key: string]: any;
}

export interface CustomEvent<K = string[]> {
  event: K;
  handler?: (event: any) => void;
}

export interface EventHandlers {
  onAdd?: (event: LeafletEvent) => void;
  onAnimationEnd?: (event: LeafletEvent) => void;
  onAutopanStart?: (event: LeafletEvent) => void;
  onBaseLayerChange?: (event: LayersControlEvent) => void;
  onClick?: (event: LeafletMouseEvent) => void;
  onContextMenu?: (event: LeafletMouseEvent) => void;
  onDblClick?: (event: LeafletMouseEvent) => void;
  onDown?: (event: LeafletEvent) => void;
  onDrag?: (event: LeafletEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragStart?: (event: LeafletEvent) => void;
  onError?: (event: LeafletEvent) => void;
  onKeyDown?: (event: LeafletKeyboardEvent) => void;
  onKeyPress?: (event: LeafletKeyboardEvent) => void;
  onKeyUp?: (event: LeafletKeyboardEvent) => void;
  onLayerAdd?: (event: LayerEvent) => void;
  onLayerRemove?: (event: LayerEvent) => void;
  onLoad?: (event: LeafletEvent) => void;
  onLoading?: (event: LeafletEvent) => void;
  onLocationError?: (event: ErrorEvent) => void;
  onLocationFound?: (event: LocationEvent) => void;
  onMouseDown?: (event: LeafletMouseEvent) => void;
  onMouseMove?: (event: LeafletMouseEvent) => void;
  onMouseOut?: (event: LeafletMouseEvent) => void;
  onMouseOver?: (event: LeafletMouseEvent) => void;
  onMouseUp?: (event: LeafletMouseEvent) => void;
  onMove?: (event: LeafletEvent) => void;
  onMoveEnd?: (event: LeafletEvent) => void;
  onMoveStart?: (event: LeafletEvent) => void;
  onOverlayAdd?: (event: LayersControlEvent) => void;
  onOverlayRemove?: (event: LayersControlEvent) => void;
  onPopupClose?: (event: PopupEvent) => void;
  onPopupOpen?: (event: PopupEvent) => void;
  onPreClick?: (event: LeafletMouseEvent) => void;
  onPreDrag?: (event: LeafletEvent) => void;
  onRemove?: (event: LeafletEvent) => void;
  onResize?: (event: ResizeEvent) => void;
  onSpiderfied?: (event: MarkerClusterSpiderfyEvent) => void;
  onTileAbort?: (event: TileEvent) => void;
  onTileError?: (event: TileErrorEvent) => void;
  onTileLoad?: (event: TileEvent) => void;
  onTileLoadStart?: (event: TileEvent) => void;
  onTileUnload?: (event: TileEvent) => void;
  onTooltipClose?: (event: TooltipEvent) => void;
  onTooltipOpen?: (event: TooltipEvent) => void;
  onUnload?: (event: LeafletEvent) => void;
  onUnspiderfied?: (event: MarkerClusterSpiderfyEvent) => void;
  onUpdate?: (event: LeafletEvent) => void;
  onViewReset?: (event: LeafletEvent) => void;
  onZoom?: (event: LeafletEvent) => void;
  onZoomAnim?: (event: ZoomAnimEvent) => void;
  onZoomEnd?: (event: LeafletEvent) => void;
  onZoomLevelsChange?: (event: LeafletEvent) => void;
  onZoomStart?: (event: LeafletEvent) => void;
}

export interface UseElementEventsHook<K = string[]> {
  element?: Layer | LayerGroup | Map | Tooltip | Popup;
  props: Props;
  customEvents?: CustomEvent<K>[];
}

/**
 * `@recommended` Hook for transform leaflet events in component props.
 *
 * `@warn` customEvents override default events props.
 *
 * TS Helper
 *
 * 1° `Keys of events`
 */
export const useElementEvents = <K extends string>({
  element,
  props,
  customEvents = [],
}: UseElementEventsHook<K>): void => {
  const prevProps = useRef<Event[]>([]); // prev props is a store of all events passed to the DOM, in order to cleanup if necessary.

  useEffect(() => {
    if (!element) return;

    const defaultEvents: Event[] = [
      { event: 'add', handler: props?.onAdd },
      { event: 'animationend', handler: props?.onAnimationEnd },
      { event: 'autopanstart', handler: props?.onAutopanStart },
      { event: 'baselayerchange', handler: props?.onBaseLayerChange },
      { event: 'click', handler: props?.onClick },
      { event: 'contextmenu', handler: props?.onContextMenu },
      { event: 'dblclick', handler: props?.onDblClick },
      { event: 'down', handler: props?.onDown },
      { event: 'drag', handler: props?.onDrag },
      { event: 'dragend', handler: props?.onDragEnd },
      { event: 'dragstart', handler: props?.onDragStart },
      { event: 'error', handler: props?.onError },
      { event: 'keydown', handler: props?.onKeyDown },
      { event: 'keypress', handler: props?.onKeyPress },
      { event: 'keyup', handler: props?.onKeyUp },
      { event: 'layeradd', handler: props?.onLayerAdd },
      { event: 'layerremove', handler: props?.onLayerRemove },
      { event: 'load', handler: props?.onLoad },
      { event: 'loading', handler: props?.onLoading },
      { event: 'locationerror', handler: props?.onLocationError },
      { event: 'locationfound', handler: props?.onLocationFound },
      { event: 'mousedown', handler: props?.onMouseDown },
      { event: 'mousemove', handler: props?.onMouseMove },
      { event: 'mouseout', handler: props?.onMouseOut },
      { event: 'mouseover', handler: props?.onMouseOver },
      { event: 'mouseup', handler: props?.onMouseUp },
      { event: 'move', handler: props?.onMove },
      { event: 'moveend', handler: props?.onMoveEnd },
      { event: 'movestart', handler: props?.onMoveStart },
      { event: 'overlayadd', handler: props?.onOverlayAdd },
      { event: 'overlayremove', handler: props?.onOverlayRemove },
      { event: 'popupclose', handler: props?.onPopupClose },
      { event: 'popupopen', handler: props?.onPopupOpen },
      { event: 'preclick', handler: props?.onPreClick },
      { event: 'predrag', handler: props?.onPreDrag },
      { event: 'remove', handler: props?.onRemove },
      { event: 'resize', handler: props?.onResize },
      { event: 'spiderfied', handler: props?.onSpiderfied },
      { event: 'tileabort', handler: props?.onTileAbort },
      { event: 'tileerror', handler: props?.onTileError },
      { event: 'tileload', handler: props?.onTileLoad },
      { event: 'tileloadstart', handler: props?.onTileLoadStart },
      { event: 'tileunload', handler: props?.onTileUnload },
      { event: 'tooltipclose', handler: props?.onTooltipClose },
      { event: 'tooltipopen', handler: props?.onTooltipOpen },
      { event: 'unload', handler: props?.onUnload },
      { event: 'unspiderfied', handler: props?.onUnspiderfied },
      { event: 'update', handler: props?.onUpdate },
      { event: 'viewreset', handler: props?.onViewReset },
      { event: 'zoom', handler: props?.onZoom },
      { event: 'zoomanim', handler: props?.onZoomAnim },
      { event: 'zoomend', handler: props?.onZoomEnd },
      { event: 'zoomlevelschange', handler: props?.onZoomLevelsChange },
      { event: 'zoomstart', handler: props?.onZoomStart },
    ];

    const events = [...defaultEvents, ...customEvents];

    events.forEach(({ event, handler }) => {
      if (!handler) return;

      const isAssigned = prevProps.current.find(
        listener => listener?.event === event,
      );

      // if a event is already assigned, first we need remove the old listener and then assign the new listener
      if (isAssigned) {
        element?.removeEventListener(event as string, isAssigned?.handler);

        prevProps.current = prevProps.current.filter(
          listener => listener?.event !== event,
        );
      }

      prevProps.current.push({
        event: event as keyof LeafletEventHandlerFnMap,
        handler,
      });

      element?.on(event as string, handler);
    });

    // Cleanup function to remove all listeners when hook dismount
    return () => {
      prevProps.current.forEach(({ event, handler }) => {
        element.off(event, handler);
      });
    };
  }, [element, props, customEvents]);
};
