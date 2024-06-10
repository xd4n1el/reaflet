import { ReactNode, forwardRef, memo, useImperativeHandle } from 'react';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';

import CanvasGroupFactory from './Factory';
import Element from '@components/Factory/Element';

export interface CanvasGroupProps {
  children?: ReactNode;
}

export type CanvasGroupRef = CanvasGroupFactory;

const CanvasGroup = memo(
  forwardRef<CanvasGroupRef, CanvasGroupProps>(({ children }, ref) => {
    const { element } = useElementFactory<CanvasGroupFactory, any>({
      Factory: CanvasGroupFactory,
      options: [],
    });
    useElementLifeCycle<any, CanvasGroupFactory>({ element });
    useImperativeHandle(ref, () => element!, [element]);

    return <Element container={element}>{children}</Element>;
  }),
);

export default CanvasGroup;
