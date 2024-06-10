import { useEffect, useRef } from 'react';
import { useElementParent } from '@hooks/useElementParent';

import { DivIcon, Icon, Layer, Map, Marker, Popup, Tooltip } from 'leaflet';

import {
  isPopup,
  isTooltip,
  isIcon,
  isDivIcon,
  getElementInstanceType,
  ElementTypeName,
} from '@helpers/validator';

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
  action: (params: any) => any;
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

  const defaultContainer = (response: any) => {
    (container as Map)?.addLayer(element as any);
    afterAdd({ container, instance: element }, response);

    return () => {
      (container as Map)?.removeLayer(element as any);
    };
  };

  const layerAsContainer = (response: any) => {
    if (isTooltip(element)) {
      (container as Layer)?.bindTooltip(element as Tooltip);
      afterAdd({ container, instance: element }, response);

      return () => {
        (element as Tooltip)?.clearAllEventListeners();
        (container as Layer).unbindTooltip();
      };
    } else if (isPopup(element)) {
      (container as Layer).bindPopup(element as Popup);
      afterAdd({ container, instance: element }, response);

      return () => {
        (element as Popup)?.clearAllEventListeners();
        (container as Layer).unbindPopup();
      };
    } else if (isIcon(element) || isDivIcon(element)) {
      (container as Marker)?.setIcon(element as Icon | DivIcon);
      afterAdd({ container, instance: element }, response);
    }
  };

  useEffect(() => {
    if (!container || !element || ready?.current) return;

    ready.current = true;

    const containerType = getElementInstanceType(container);

    const response = beforeAdd({ container, instance: element });
    let cleanupFn: (() => void) | undefined;

    const elementValidation: checkType[] = [
      {
        types: ['layer'],
        action: layerAsContainer,
      },
    ];

    for (const { action, types } of elementValidation) {
      if (types.includes(containerType!)) {
        cleanupFn = action(response);
        break;
      }
    }

    if (!cleanupFn) {
      cleanupFn = defaultContainer(response);
    }

    if (disableUnmount) {
      cleanupFn = undefined;
    }

    return () => {
      cleanupFn?.();
    };
  }, [container, element, disableUnmount]);
};
