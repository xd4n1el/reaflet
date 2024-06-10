import { ReactNode, forwardRef, memo, useImperativeHandle } from 'react';
import { EventHandlers, useElementEvents } from '@hooks/useElementEvents';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import Element from '@components/Factory/Element';
import ClusterGroupFactory, { ClusterGroupOptions } from './Factory';

import { AddChildrenEvent } from '@utils/interfaces';

interface CustomClusterGroupProps {
  children: ReactNode;
}

type ValidGroupOptions = Omit<
  ClusterGroupOptions,
  | 'chunkedLoading'
  | 'chunkDelay'
  | 'chunkSize'
  | 'chunkProgress'
  | 'chunkInterval'
>;

type ClusterEvents =
  | 'clusterclick'
  | 'clustermouseover'
  | 'clustermouseout'
  | 'add-children';

export type ClusterGroupProps = CustomClusterGroupProps &
  ValidGroupOptions &
  EventHandlers;

export type ClusterGroupRef = ClusterGroupFactory;

const ClusterGroup = memo(
  forwardRef<ClusterGroupRef, ClusterGroupProps>(
    ({ children, ...rest }, ref) => {
      const { element } = useElementFactory<
        ClusterGroupFactory,
        [ClusterGroupOptions]
      >({
        Factory: ClusterGroupFactory,
        options: [rest],
      });
      useElementEvents<ClusterEvents>({
        element,
        props: rest,
        customEvents: [
          {
            event: 'clusterclick',
            handler: rest?.onClick,
          },
          {
            event: 'clustermouseout',
            handler: rest?.onMouseOut,
          },
          {
            event: 'clustermouseover',
            handler: rest?.onMouseOver,
          },
          {
            event: 'add-children',
            handler({ elements }: AddChildrenEvent<any>) {
              element?.addLayers(elements);
            },
          },
        ],
      });
      useElementLifeCycle<any, ClusterGroupFactory>({ element });
      useElementUpdate<
        ClusterGroupFactory,
        Omit<ClusterGroupProps, 'children'>
      >({
        element,
        props: rest,
        handlers: {
          allProps(prevValues, nextValues, instance) {
            instance.setOptions(nextValues);
          },
        },
      });
      useImperativeHandle(ref, () => element!, [element]);

      return <Element container={element}>{children}</Element>;
    },
  ),
);

export default ClusterGroup;
