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
import { useElementUpdate } from '@hooks/useElementUpdate';
import { useElementParent } from '@hooks/useElementParent';

import { Layer, Marker } from 'leaflet';
import TooltipFactory, { TooltipOptions } from './Factory';
import ElementPortal, {
  ElementPortalRef,
} from '@components/Factory/ElementPortal';

import {
  compareObjects,
  excludeEvents,
  excludeProperties,
} from '@utils/functions';

interface TooltipDefaultProps {
  children?: ReactNode;
  isOpen?: boolean;
}

export type TooltipProps = Omit<TooltipOptions, 'content'> &
  EventHandlers &
  TooltipDefaultProps;

export type TooltipRef = TooltipFactory;

const Tooltip = memo(
  forwardRef<TooltipRef, TooltipProps>(
    ({ children, isOpen = false, ...rest }, ref) => {
      const elementPortalRef = useRef<ElementPortalRef>(null);

      const { container } = useElementParent();
      const { element } = useElementFactory<
        TooltipFactory,
        [TooltipOptions, Layer]
      >({
        Factory: TooltipFactory,
        options: [rest, container],
      });
      useElementLifeCycle<Marker, TooltipFactory>({ element });
      useElementEvents({ element, props: rest });
      useElementUpdate<
        TooltipFactory,
        Omit<TooltipDefaultProps, 'children'> & Omit<TooltipOptions, 'content'>
      >({
        element: element,
        props: { ...rest, isOpen },
        handlers: {
          offset(prevValue, nextValue, element) {
            if (!Array.isArray(nextValue)) return;

            const [x, y] = (prevValue as any) || [];

            if (x !== nextValue[0] || y !== nextValue[1]) {
              element?.setOptions({
                offset: nextValue,
              });
            }
          },
          isOpen(prevValue, nextValue, instance) {
            const alreadyOpen = instance?.isOpen();

            if (nextValue && !alreadyOpen) {
              container?.openTooltip();
            } else if (!nextValue && alreadyOpen) {
              container?.closeTooltip();
            }
          },
          opacity(prevValue, nextValue, instance) {
            if (typeof nextValue !== 'number') return;

            instance?.setOpacity(nextValue);
          },
          allProps(prevValues, nextValues, instance) {
            let prevProps = excludeProperties<TooltipProps>(prevValues, [
              'children',
              'isOpen',
              'opacity',
              'offset',
            ]);

            let nextProps = excludeProperties<TooltipProps>(nextValues, [
              'children',
              'isOpen',
              'opacity',
              'offset',
            ]);

            prevProps = excludeEvents<TooltipProps>(prevProps as any);
            nextProps = excludeEvents<TooltipProps>(nextProps as any);

            const changes = compareObjects(prevProps, nextProps);

            if (Object.keys(changes)?.length > 0) {
              instance?.setOptions(changes);
            }
          },
        },
        afterUpdateProps(element) {
          if (!element) return;

          element?.update();
        },
      });
      useImperativeHandle(ref, () => element!, [element]);

      const onTooltipOpen = () => {
        setTimeout(() => {
          element?.update();
          elementPortalRef.current?.update();
        }, 0);
      };

      const onTooltipClose = () => {
        elementPortalRef.current?.update();
      };

      useEffect(() => {
        if (!element || !container) return;

        container.on({
          tooltipclose: onTooltipClose,
          tooltipopen: onTooltipOpen,
        });

        if (isOpen) container?.openTooltip();

        return () => {
          if (container) {
            container.off({
              tooltipclose: onTooltipClose,
              tooltipopen: onTooltipOpen,
            });

            container.unbindTooltip();
          }
        };
      }, [element, container]);

      useEffect(() => {
        if (!element || !container) return;

        const alreadyOpen = element.isOpen();

        if (isOpen && !alreadyOpen) {
          container?.openTooltip();
        } else if (!isOpen && alreadyOpen) {
          container?.closeTooltip();
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

export default Tooltip;
