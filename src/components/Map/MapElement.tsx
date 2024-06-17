import { memo, useEffect } from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';
import { useElementParent } from '@hooks/useElementParent';
import { useMapFactory } from '@hooks/useMapFactory';

import Element from '@components/Factory/Element';
import MapFactory, { MapOptions } from './Factory';
import { LatLng, LatLngBounds, LatLngExpression } from 'leaflet';

interface CustomMapElementProps {
  children?: React.ReactNode;
}

type ValidMapOptions = Omit<MapOptions, 'zoomControl'>;
type Events = Omit<EventHandlers, 'onSpiderfied' | 'onUnspiderfied'>;

export type MapElementProps = ValidMapOptions & CustomMapElementProps & Events;

const MapElement = memo<MapElementProps>(({ children, ...rest }) => {
  const { createMap, destroyMap } = useMapFactory();
  const { container } = useElementParent();
  const { element } = useElementFactory<
    MapFactory,
    [HTMLElement | null, MapOptions]
  >({
    Factory: MapFactory,
    options: [container, { ...rest }],
    afterCreation: createMap,
    validation: {
      containerIsRequired: true,
    },
  });
  useElementEvents({ element, props: rest });
  useElementUpdate<MapFactory, ValidMapOptions>({
    element,
    props: rest,
    handlers: {
      center(prevValue, nextValue, instance) {
        const isEqual = instance
          .getCenter()
          .equals(nextValue as LatLngExpression);

        const isPropEqual = (nextValue as LatLng).equals(
          prevValue as LatLngExpression,
        );

        if (isEqual || isPropEqual) return;

        instance.setView(nextValue as LatLngExpression);
      },
      maxBounds(prevValue, nextValue, instance) {
        const isEqual = instance.getBounds().equals(nextValue as LatLngBounds);

        if (isEqual) return;

        instance.setMaxBounds(nextValue as LatLngBounds);
      },
      maxZoom(prevValue, nextValue, instance) {
        if (prevValue === nextValue || typeof nextValue !== 'number') return;

        instance.setMaxZoom(nextValue);
      },
      minZoom(prevValue, nextValue, instance) {
        if (prevValue === nextValue || typeof nextValue !== 'number') return;

        instance.setMinZoom(nextValue);
      },
      scrollWheelZoom(prevValue, nextValue, instance) {
        const isEnabled = instance.scrollWheelZoom.enabled();

        if (isEnabled && !nextValue) {
          instance.scrollWheelZoom.disable();
        } else if (!isEnabled && nextValue) {
          instance.scrollWheelZoom.enable();
        }
      },
      doubleClickZoom(prevValue, nextValue, instance) {
        const isEnabled = instance.doubleClickZoom.enabled();

        if (isEnabled && !nextValue) {
          instance.doubleClickZoom.disable();
        } else if (!isEnabled && nextValue) {
          instance.doubleClickZoom.enable();
        }
      },
      keyboard(prevValue, nextValue, instance) {
        const isEnabled = instance.keyboard.enabled();

        if (isEnabled && !nextValue) {
          instance.keyboard.disable();
        } else if (!isEnabled && nextValue) {
          instance.keyboard.enable();
        }
      },
      dragging(prevValue, nextValue, instance) {
        const isEnabled = instance.dragging.enabled();

        if (isEnabled && !nextValue) {
          instance.dragging.disable();
        } else if (!isEnabled && nextValue) {
          instance.dragging.enable();
        }
      },
      tap(prevValue, nextValue, instance) {
        const isEnabled = instance.tap?.enabled();

        if (isEnabled && !nextValue) {
          instance?.tap?.disable();
        } else if (!isEnabled && nextValue) {
          instance?.tap?.enable();
        }
      },
      touchZoom(prevValue, nextValue, instance) {
        const isEnabled = instance.touchZoom.enabled();

        if (isEnabled && !nextValue) {
          instance?.touchZoom?.disable();
        } else if (!isEnabled && nextValue) {
          instance?.touchZoom?.enable();
        }
      },
      boxZoom(prevValue, nextValue, instance) {
        const isEnabled = instance.boxZoom.enabled();

        if (isEnabled && !nextValue) {
          instance?.boxZoom?.disable();
        } else if (!isEnabled && nextValue) {
          instance?.boxZoom?.enable();
        }
      },
      zoom(prevValue, nextValue, instance) {
        if (prevValue === nextValue || typeof nextValue !== 'number') return;

        instance.setZoom(nextValue as number);
      },
      attributionControl(prevValue, nextValue, instance) {
        const isEnabled = instance.attributionControl.getContainer();

        if (isEnabled && !nextValue) {
          instance.attributionControl.remove();
        } else if (!isEnabled && nextValue) {
          instance.attributionControl.addTo(instance);
        }
      },
      allProps(prevValues, nextValues, instance) {
        instance.setOptions(nextValues);
      },
    },
  });

  useEffect(() => {
    if (!element) return;

    return () => {
      element?.clearAllEventListeners();
      destroyMap();
    };
  }, [element, destroyMap]);

  return <Element container={element}>{children}</Element>;
});

export default MapElement;
