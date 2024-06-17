import { forwardRef, memo, useImperativeHandle } from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import { LatLngBounds, LatLngBoundsExpression } from 'leaflet';
import ImageOverlayFactory, { ImageOverlayOptions } from './Factory';

import { InvalidMethods } from '@utils/types';
import { validateNodeClasses } from '@/utils/functions';

interface CustomImageOverlayProps {
  src: string;
  bounds: LatLngBoundsExpression;
}

type Events = Omit<EventHandlers, 'onSpiderfied' | 'onUnspiderfied'>;
type Factory = Omit<ImageOverlayFactory, InvalidMethods>;

export type ImageOverlayProps = CustomImageOverlayProps &
  ImageOverlayOptions &
  Events;

export type ImageOverlayRef = Factory;

const ImageOverlay = forwardRef<ImageOverlayFactory, ImageOverlayProps>(
  ({ src, bounds, ...rest }, ref) => {
    const { element } = useElementFactory<
      ImageOverlayFactory,
      [string, LatLngBoundsExpression, ImageOverlayOptions]
    >({
      Factory: ImageOverlayFactory,
      options: [src, bounds, rest],
    });
    useElementLifeCycle({ element });
    useElementEvents({ element, props: rest });
    useElementUpdate<ImageOverlayFactory, ImageOverlayProps>({
      element,
      props: { ...rest, bounds, src },
      handlers: {
        src(prevValue, nextValue, instance) {
          instance.setUrl(nextValue);
        },
        opacity(prevValue, nextValue, instance) {
          if (typeof nextValue !== 'number' || prevValue === nextValue) return;

          instance.setOpacity(nextValue);
        },
        bounds(prevValue, nextValue, instance) {
          instance.setBounds(nextValue as LatLngBounds);
        },
        className(prevValue, nextValue, instance) {
          const node = instance.getNode();

          validateNodeClasses(prevValue!, nextValue!, node!);
        },
        allProps(prevValues, nextValues, instance) {
          instance.setOptions(nextValues);
        },
      },
    });
    useImperativeHandle(ref, () => element!, [element]);

    return null;
  },
);

export default memo(ImageOverlay);
