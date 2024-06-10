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

interface CustomPopupProps {
  position?: LatLngExpression;
  children?: ReactNode;
  isOpen?: boolean;
}

type ValidPopupOptions = Omit<PopupOptions, 'content'>;

export type PopupProps = CustomPopupProps & ValidPopupOptions & EventHandlers;

export type PopupRef = PopupFactory;

const Popup = memo(
  forwardRef<PopupRef, PopupProps>(
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
      useElementEvents({ element, props: rest });
      useElementUpdate<PopupFactory, PopupProps>({
        element,
        props: { ...rest, position },
        handlers: {
          isOpen(prevValue, nextValue, instance) {
            const alreadyOpen = instance.isOpen();

            if (alreadyOpen && !nextValue) {
              container?.closePopup();
            } else if (!alreadyOpen && nextValue) {
              container?.openPopup();
            }
          },
          allProps(prevValues, nextValues, instance) {
            instance.setOptions(nextValues);
          },
          position(prevValue, nextValue, instance) {
            instance.setLatLng(nextValue as LatLngExpression);
          },
        },
      });
      useElementLifeCycle<any, PopupFactory>({ element });
      useImperativeHandle(ref, () => element!, [element]);

      const popupopen = () => {
        setTimeout(() => {
          element?.update();
          elementPortalRef.current?.update();
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
  ),
);

export default Popup;
