import { forwardRef, memo, useImperativeHandle } from 'react';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import TileLayerWMSFactory, { TileLayerWMSOptions } from './Factory';

import { LayerMethods } from '@utils/types';
import { validateNodeClasses } from '@utils/functions';
import { WMSParams } from 'leaflet';

interface CustomTileLayerWMSProps {
  url: string;
  params?: WMSParams;
}

type Factory = Omit<TileLayerWMSFactory, LayerMethods>;

export type TileLayerWMSProps = CustomTileLayerWMSProps & TileLayerWMSOptions;
export type TileLayerWMSRef = Factory;

const TileLayerWMS = forwardRef<TileLayerWMSRef, TileLayerWMSProps>(
  ({ url, params, ...rest }, ref) => {
    const { element } = useElementFactory<
      TileLayerWMSFactory,
      [string, TileLayerWMSOptions, WMSParams]
    >({
      Factory: TileLayerWMSFactory,
      options: [url, rest, params!],
    });
    useElementLifeCycle({ element });
    useElementUpdate<TileLayerWMSFactory, TileLayerWMSProps>({
      element,
      props: { ...rest, params, url },
      handlers: {
        opacity(prevValue, nextValue, instance) {
          if (prevValue === nextValue || typeof nextValue !== 'number') return;

          instance?.setOpacity(nextValue);
        },
        className(prevValue, nextValue, instance) {
          const node = instance?.getNode();

          if (!node) return;

          validateNodeClasses(prevValue!, nextValue!, node);
        },
        params(prevValue, nextValue, instance) {
          instance?.setParams(nextValue!);
        },
        allProps(prevValues, nextValues, instance) {
          instance?.setOptions(nextValues);
        },
      },
    });
    useImperativeHandle(ref, () => element!, [element]);

    return null;
  },
);

export default memo(TileLayerWMS);
