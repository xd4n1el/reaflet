import {
  ReactNode,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementParent } from '@hooks/useElementParent';
import { useElementUpdate } from '@hooks/useElementUpdate';

import { LatLngExpression } from 'leaflet';
import PopupFactory, { PopupOptions } from './Factory';
import ElementPortal, {
  ElementPortalRef,
} from '@components/Factory/ElementPortal';

import { LayerMethods } from '@utils/types';
import { validateNodeClasses } from '@utils/functions';

interface CustomPopupProps {
  position?: LatLngExpression;
  children?: ReactNode;
  isOpen?: boolean;
}

type ValidPopupOptions = Omit<PopupOptions, 'content'>;
type Events = Omit<
  EventHandlers,
  | 'onSpiderfied'
  | 'onUnspiderfied'
  | 'onPopupOpen'
  | 'onPopupClose'
  | 'onTooltipOpen'
  | 'onTooltipClose'
>;
type Factory = Omit<PopupFactory, LayerMethods>;

export type PopupProps = CustomPopupProps & ValidPopupOptions & Events;
export type PopupRef = Factory;

const Popup = forwardRef<PopupRef, PopupProps>(
  ({ position, isOpen, children, ...rest }, ref) => {
    const elementPortalRef = useRef<ElementPortalRef>(null);

    const { container } = useElementParent();
    const { element } = useElementFactory<
      PopupFactory,
      [LatLngExpression, PopupOptions]
    >({
      Factory: PopupFactory,
      options: [position!, rest],
    });
    useElementLifeCycle({ element });
    useElementEvents({ element, props: rest });
    useElementUpdate<PopupFactory, PopupProps>({
      element,
      props: { ...rest, position },
      handlers: {
        position(prevValue, nextValue, instance) {
          instance.setLatLng(nextValue as LatLngExpression);
        },
        isOpen(prevValue, nextValue, instance) {
          const alreadyOpen = instance.isOpen();

          if (alreadyOpen && !nextValue) {
            container?.closePopup();
          } else if (!alreadyOpen && nextValue) {
            container?.openPopup();
          }
        },
        className(prevValue, nextValue, instance) {
          const node = instance?.getNode();

          if (!node) return;

          validateNodeClasses(prevValue!, nextValue!, node);
        },
        interactive(prevValue, nextValue, instance) {
          instance.setInteractive(nextValue as boolean);
        },
        allProps(prevValues, nextValues, instance) {
          instance.setOptions(nextValues);
        },
      },
    });
    useImperativeHandle(ref, () => element!, [element]);

    const popupopen = () => {
      elementPortalRef.current?.update();

      setTimeout(() => {
        element?.update();
      }, 0);
    };

    const popupclose = () => {
      elementPortalRef.current?.update();
    };

    useEffect(() => {
      if (!element || !container) return;

      container?.on({
        popupopen,
        popupclose,
      });

      return () => {
        container?.unbindPopup();
        container?.off({
          popupopen,
          popupclose,
        });
      };
    }, [element, container]);

    useEffect(() => {
      if (!element || !container) return;

      const alreadyOpen = element.isOpen();

      if (isOpen && !alreadyOpen) {
        container?.openTooltip();
      } else if (!isOpen && alreadyOpen) {
        container?.closePopup();
      }
    }, [element, container, isOpen]);

    return (
      <ElementPortal ref={elementPortalRef} element={element}>
        {children}
      </ElementPortal>
    );
  },
);

export default memo(Popup);
