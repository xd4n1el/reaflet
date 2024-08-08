import { useEffect, useRef } from 'react';
import { useElementParent } from '@hooks/useElementParent';

import {
  DivIcon,
  Icon,
  Layer,
  LayerGroup,
  Map,
  Marker,
  Popup,
  Tooltip,
} from 'leaflet';

import Validator, { ElementTypeName } from '@helpers/validator';

export interface AddCallback<T = any, U = any> {
  container?: T;
  instance?: U;
}

export interface UseElementLifeCycleHook<T = any, U = any> {
  element?: U;
  beforeAdd?: (params: AddCallback<T, U>) => void;
  afterAdd?: (params: AddCallback<T, U>, response?: any) => void;
}

interface checkType {
  types: ElementTypeName[];
  action: () => any;
}

/**
 * `@recommended` Hook that handle the add/remove of elements in map
 *
 * TS Helper
 *
 * 1° `Container type`
 *
 * 2° `Element type`
 */
export const useElementLifeCycle = <T extends object = any, U = any>({
  element,
  beforeAdd = () => {},
  afterAdd = () => {},
}: UseElementLifeCycleHook<T, U>): void => {
  const ready = useRef<boolean>(false);

  const { container, preventUnmount: disableUnmount } = useElementParent();

  const validator = new Validator();

  const bindElementToContainer = () => {
    if (validator.isPopup(element)) {
      (element as Popup).openOn(container as Map);

      return () => {
        (container as Map)?.removeLayer(element as Popup);
      };
    } else if (
      validator.isFeatureGroup(element) ||
      validator.isLayerGroup(element) ||
      validator.isControl(element)
    ) {
      (element as LayerGroup)?.addTo(container as Map);

      return () => {
        (element as LayerGroup)?.remove();
      };
    } else {
      (container as Map)?.addLayer(element as any);

      return () => {
        (container as Map)?.removeLayer(element as any);
      };
    }
  };

  const bindElementToLayer = () => {
    if (validator?.isTooltip(element)) {
      (container as Layer)?.bindTooltip(element as Tooltip);

      return () => {
        (element as Tooltip)?.clearAllEventListeners();
        (container as Layer).unbindTooltip();
      };
    } else if (validator?.isPopup(element)) {
      (container as Layer).bindPopup(element as Popup);

      return () => {
        (element as Popup)?.clearAllEventListeners();
        (container as Layer).unbindPopup();
      };
    } else if (validator?.isIcon(element) || validator?.isDivIcon(element)) {
      (container as Marker)?.setIcon(element as Icon | DivIcon);
    } else {
      (container as Map)?.addLayer(element as Marker);

      return () => {
        (container as Map)?.removeLayer(element as Marker);
      };
    }
  };

  useEffect(() => {
    if (!container || !element || ready?.current) return;

    ready.current = true;

    const containerType = validator.getElementInstanceType(container);

    const response = beforeAdd({ container, instance: element });
    let cleanupFn: (() => void) | undefined;

    const elementValidation: checkType[] = [
      {
        types: ['layer'],
        action: bindElementToLayer,
      },
    ];

    const { action } =
      elementValidation.find(({ types }) => types.includes(containerType!)) ||
      {};

    if (action) {
      cleanupFn = action();
    } else if (!disableUnmount) {
      cleanupFn = bindElementToContainer();
    }

    afterAdd({ container, instance: element }, response);

    return () => {
      cleanupFn?.();
    };
  }, [container, element, disableUnmount]);
};
