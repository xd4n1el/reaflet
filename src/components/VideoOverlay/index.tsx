import { forwardRef, memo, useImperativeHandle } from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import { LatLngBounds, LatLngBoundsExpression } from 'leaflet';
import VideoOverlayFactory, { Video, VideoOverlayOptions } from './Factory';

import { InvalidMethods } from '@utils/types';
import { validateNodeClasses } from '@utils/functions';

interface CustomVideoOverlayProps {
  src: string;
  bounds: LatLngBoundsExpression;
}

type Events = Omit<EventHandlers, 'onSpiderfied' | 'onUnspiderfied'>;
type Factory = Omit<VideoOverlayFactory, InvalidMethods>;

export type VideoOverlayProps = CustomVideoOverlayProps &
  VideoOverlayOptions &
  Events;

export type VideoOverlayRef = Factory;

const VideoOverlay = forwardRef<VideoOverlayRef, VideoOverlayProps>(
  ({ src, bounds, ...rest }, ref) => {
    const { element } = useElementFactory<
      VideoOverlayFactory,
      [Video, LatLngBoundsExpression, VideoOverlayOptions]
    >({
      Factory: VideoOverlayFactory,
      options: [src, bounds, rest],
      validation: {
        containerIsRequired: true,
      },
    });
    useElementLifeCycle({ element });
    useElementEvents({ element, props: rest });
    useElementUpdate<VideoOverlayFactory, VideoOverlayProps>({
      element,
      props: { ...rest, src, bounds },
      handlers: {
        src(prevValue, nextValue, instance) {
          if (prevValue === nextValue) return;

          instance.setUrl(nextValue);
        },
        bounds(prevValue, nextValue, instance) {
          instance.setBounds(nextValue as LatLngBounds);
        },
        opacity(prevValue, nextValue, instance) {
          if (typeof nextValue !== 'number' || prevValue === nextValue) return;

          instance.setOpacity(nextValue);
        },
        className(prevValue, nextValue, instance) {
          const node = instance?.getNode();

          if (!node) return;

          validateNodeClasses(prevValue!, nextValue!, node);
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

export default memo(VideoOverlay);
