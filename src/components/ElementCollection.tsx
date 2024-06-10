import {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  forwardRef,
  isValidElement,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useElementParent } from '@hooks/useElementParent';

import { LayerEvent, Map } from 'leaflet';
import Element from '@components/Factory/Element';

import { chunkArray } from '@utils/functions';

interface Data<T extends any[]> {
  key: any;
  childrenProps?: { [K in keyof T]: Partial<T[K]> };
}

type DynamicProps<T = any> = Partial<Record<keyof T, any>>;

export type ElementCollectionData<
  P = any,
  T extends any[] = any[],
> = DynamicProps<P> & Data<T>;

export interface ElementCollectionProps<P = any, K extends any[] = any> {
  children: ReactNode;
  /** Array of children props */
  data: ElementCollectionData<P, K>[];
  chunkAt?: number;
  /**
   * @default 1000
   */
  maxChunkSize?: number;
  /**
   * @default 200
   */
  chunkInterval?: number;
  onChunkEnd?: () => void;
}

export interface ElementCollectionRef {
  reset: () => void;
  addElements: (elements: any[]) => void;
  setElements: (elements: any[]) => void;
}

const ElementCollection = memo(
  forwardRef<ElementCollectionRef, ElementCollectionProps>(
    (
      {
        children,
        chunkAt,
        maxChunkSize = 1000,
        chunkInterval = 200,
        onChunkEnd,
        data = [],
      },
      ref,
    ): ReactNode => {
      const [queue, setQueue] = useState<any[]>([]);

      const layers = useRef<any[]>([]);
      const interval = useRef<NodeJS.Timer | undefined>();
      const prevProps = useRef<ElementCollectionData[]>([]);

      const { container } = useElementParent();

      const reset = () => {
        setQueue([]);
        clearInterval(interval.current as any);
        interval.current = undefined;
      };

      const addElements = (elements: any[] = []) => {
        setQueue(elements);
      };

      const setElements = (elements: any[] = []) => {
        setQueue(elements);
      };

      const onLayerAdd = (event: LayerEvent) => {
        layers.current.push(event.layer);
      };

      const onLayerRemove = (event: LayerEvent) => {
        layers.current = layers.current.filter(
          (layer: any) =>
            layer?._leaflet_id !== (event as any)?.layer?._leaflet_id,
        );
      };

      const cloneWithProps = (child: ReactNode, props: any): ReactElement => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            ...props,
            children: Children.map(
              child.props.children,
              (nestedChild, index: number) => {
                const childProps = props?.childrenProps[index];

                if (!childProps) return null;

                return cloneWithProps(nestedChild, childProps);
              },
            ),
          });
        }

        return child as ReactElement;
      };

      useEffect(() => {
        if (data?.length === 0) return;

        prevProps.current = data;

        if (chunkAt && chunkAt > data?.length) {
          setQueue(data);
        } else {
          const chunks: any[][] = chunkArray(data, maxChunkSize);

          let step = 0;

          interval.current = setInterval(() => {
            if (step > chunks.length - 1) {
              if (onChunkEnd) onChunkEnd();

              setQueue([]);

              return clearInterval(interval.current as any);
            } else {
              const chunk: any[] = chunks[step];

              setQueue(chunk);

              step += 1;
            }
          }, chunkInterval);

          return () => {
            clearInterval(interval.current as any);
          };
        }
      }, [data, chunkInterval, maxChunkSize, chunkAt, onChunkEnd]);

      useEffect(() => {
        if (!container) return;

        (container as Map).on('layeradd', onLayerAdd);
        (container as Map).on('layerremove', onLayerRemove);

        return () => {
          (container as Map).off('layeradd', onLayerAdd);
          (container as Map).off('layerremove', onLayerRemove);

          if (container?.removeLayers) {
            container?.removeLayers(layers.current);
          } else {
            layers.current.forEach(layer => {
              layer?.clearAllEventListeners();
              (container as Map)?.removeLayer(layer);
            });
          }
        };
      }, [container]);

      useImperativeHandle(
        ref,
        () => ({
          reset,
          addElements,
          setElements,
        }),
        [],
      );

      return (
        <Element container={container} preventUnmount>
          {queue.map((item: any) =>
            cloneWithProps(children as ReactElement, item),
          )}
        </Element>
      );
    },
  ),
);

export default ElementCollection;
