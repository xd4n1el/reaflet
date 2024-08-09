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

import { Layer, Marker, TooltipEvent } from 'leaflet';
import TooltipFactory, { TooltipOptions } from './Factory';
import ElementPortal, {
  ElementPortalRef,
} from '@components/Factory/ElementPortal';

import { LayerMethods } from '@utils/types';
import { compareObjects, validateNodeClasses } from '@utils/functions';

interface CustomTooltipProps {
  children?: ReactNode;
  isOpen?: boolean;
}

type Options = Omit<TooltipOptions, 'content'>;
type Events = Omit<
  EventHandlers,
  | 'onSpiderfied'
  | 'onUnspiderfied'
  | 'onTooltipClose'
  | 'onTooltipOpen'
  | 'onPopupOpen'
  | 'onPopupClose'
>;
type Factory = Omit<TooltipFactory, LayerMethods>;

export type TooltipProps = Options & Events & CustomTooltipProps;
export type TooltipRef = Factory;

const Tooltip = forwardRef<TooltipRef, TooltipProps>(
  ({ children, isOpen = false, ...rest }, ref) => {
    const elementPortalRef = useRef<ElementPortalRef>(null);

    const validateDirection = (node: HTMLElement, direction: string) => {
      const preset = 'leaflet-tooltip-';

      if (!node || node.classList.contains(`${preset}${direction}`)) return;

      node.classList.remove(
        `${preset}right`,
        `${preset}left`,
        `${preset}top`,
        `${preset}bottom`,
      );

      node.classList.add(`${preset}${direction}`);
    };

    const { container } = useElementParent();
    const { element } = useElementFactory<
      TooltipFactory,
      [TooltipOptions, Layer]
    >({
      Factory: TooltipFactory,
      options: [rest, container],
      validation: {
        containerIsRequired: true,
      },
      afterCreation() {
        if (elementPortalRef?.current) {
          elementPortalRef?.current?.update();
        }
      },
    });
    useElementLifeCycle<Marker, TooltipFactory>({ element });
    useElementEvents({ element, props: rest });
    useElementUpdate<
      TooltipFactory,
      Omit<CustomTooltipProps, 'children'> & Omit<TooltipOptions, 'content'>
    >({
      element: element,
      props: { ...rest, isOpen },
      handlers: {
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
        className(prevValue, nextValue, instance) {
          const node = instance?.getNode();

          if (!node) return;

          validateNodeClasses(prevValue!, nextValue!, node);
        },
        direction(prevValue, nextValue, instance) {
          instance.options.direction = nextValue;
        },
        allProps(prevValues, nextValues, instance) {
          const changes = compareObjects(prevValues, nextValues);

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

    const onTooltipOpen = (event: TooltipEvent) => {
      const tltp = event.tooltip as TooltipFactory;
      const direction = tltp.options.direction;
      const node = tltp?.getNode();

      if (node) validateDirection(node, direction!);

      setTimeout(() => {
        elementPortalRef.current?.update();
        element?.update();
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

      const alreadyOpen = element?.isOpen();

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
);

export default memo(Tooltip);
