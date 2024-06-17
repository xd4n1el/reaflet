import { forwardRef, memo, useImperativeHandle } from 'react';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import TileLayerFactory, { TileLayerOptions } from './Factory';

import { LayerMethods } from '@utils/types';
import { validateNodeClasses } from '@utils/functions';

type Factory = Omit<TileLayerFactory, LayerMethods>;

export interface TileLayerProps extends TileLayerOptions {
  url: string;
}

export type TileLayerRef = Factory;

const TileLayer = forwardRef<TileLayerRef, TileLayerProps>(
  ({ url, ...rest }, ref) => {
    const { element } = useElementFactory<
      TileLayerFactory,
      [string, TileLayerOptions]
    >({
      Factory: TileLayerFactory,
      options: [url, rest],
    });
    useElementLifeCycle({ element });
    useElementUpdate<TileLayerFactory, TileLayerProps>({
      element,
      props: { ...rest, url },
      handlers: {
        opacity(prevValue, nextValue, instance) {
          if (prevValue !== nextValue && typeof nextValue === 'number') {
            instance.setOpacity(nextValue);
          }
        },
        url(prevValue, nextValue, instance) {
          if (prevValue !== nextValue) {
            instance.setUrl(nextValue);
          }
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

export default memo(TileLayer);
