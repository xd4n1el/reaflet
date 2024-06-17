import { forwardRef, memo, useImperativeHandle } from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';
import { useElementParent } from '@hooks/useElementParent';

import { LatLngBounds, LatLngBoundsExpression } from 'leaflet';
import SVGOverlayFactory, { SVGOverlayOptions } from './Factory';

import { InvalidMethods } from '@utils/types';
import { validateNodeClasses } from '@utils/functions';

export type SVG = string | SVGElement;

interface CustomSVGOverlayElementProps {
  bounds: LatLngBoundsExpression;
  svg?: SVG;
}

type Events = Omit<EventHandlers, 'onSpiderfied' | 'onUnspiderfied'>;
type Factory = Omit<SVGOverlayFactory, InvalidMethods>;

export type SVGOverlayElementProps = CustomSVGOverlayElementProps &
  SVGOverlayOptions &
  Events;

export type SVGOverlayElementRef = Factory;

const SVGOverlayElement = forwardRef<
  SVGOverlayElementRef,
  SVGOverlayElementProps
>(({ bounds, ...rest }, ref) => {
  const { container } = useElementParent();
  const { element } = useElementFactory<
    SVGOverlayFactory,
    [SVG, LatLngBoundsExpression, SVGOverlayOptions]
  >({
    Factory: SVGOverlayFactory,
    options: [container, bounds, rest],
    validation: {
      containerIsRequired: true,
    },
  });
  useElementEvents({ element, props: rest });
  useElementUpdate<SVGOverlayFactory, SVGOverlayElementProps>({
    element,
    props: { ...rest, bounds },
    handlers: {
      bounds(prevValue, nextValue, instance) {
        instance.setBounds(nextValue as LatLngBounds);
      },
      className(prevValue, nextValue, instance) {
        const node = instance?.getNode();

        if (!node) return;

        validateNodeClasses(prevValue!, nextValue!, node);
      },
      interactive(prevValue, nextValue, instance) {
        if (typeof nextValue !== 'boolean') return;

        instance?.setInteractive(nextValue);
      },
      opacity(prevValue, nextValue, instance) {
        if (prevValue === nextValue || typeof nextValue !== 'number') return;

        instance.setOpacity(nextValue);
      },
      allProps(prevValues, nextValues, instance) {
        instance.setOptions(nextValues);
      },
    },
  });
  useImperativeHandle(ref, () => element!, [element]);

  return null;
});

export default memo(SVGOverlayElement);
