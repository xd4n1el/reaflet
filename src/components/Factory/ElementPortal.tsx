import {
  ReactNode,
  ReactPortal,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import { createPortal } from 'react-dom';

export interface Element {
  getNode: () => HTMLElement | undefined;
  [key: string]: any;
}

export interface ElementPortalProps<T extends Element = any> {
  element?: T;
  children: ReactNode;
}

export interface ElementPortalRef {
  update: () => void;
}

const ElementPortal = memo(
  forwardRef<ElementPortalRef, ElementPortalProps>(
    ({ children, element }, ref): ReactPortal | null => {
      const [node, setNode] = useState<HTMLElement | null>(null);
      const [update, setUpdate] = useState<boolean>(false);

      useEffect(() => {
        if (!element) return;

        const root = element?.getNode() as HTMLElement;

        setNode(root);
      }, [element, update]);

      const updateComponent = () => {
        setUpdate(state => !state);
      };

      useImperativeHandle(
        ref,
        () => ({
          update: updateComponent,
        }),
        [],
      );

      if (node && children && element) {
        return createPortal(children, node);
      }

      return null;
    },
  ),
);

export default ElementPortal;
