import {
  ReactNode,
  ReactPortal,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Root, createRoot } from 'react-dom/client';

export interface Element {
  getNode: () => HTMLElement | undefined;
  [key: string]: any;
}

export interface ElementRootProps<T extends Element = any> {
  /** Instance of leaflet element */
  element?: T;
  children: ReactNode;
}

export interface ElementRootRef {
  update: () => void;
}

const ElementRoot = forwardRef<ElementRootRef, ElementRootProps>(
  ({ children, element }, ref): ReactPortal | null => {
    const [node, setNode] = useState<Root | null>(null);
    const [update, setUpdate] = useState<boolean>(false);

    const updateComponent = () => {
      setUpdate(state => !state);
    };

    useEffect(() => {
      if (!element) return;

      if (!node) {
        const domNode = element?.getNode() as HTMLElement;

        if (!domNode) return;

        const root = createRoot(domNode);

        setNode(root);

        root.render(children);

        return () => {
          root.unmount();
        };
      } else {
        node.render(children);
      }
    }, [element, children, node, update]);

    useImperativeHandle(
      ref,
      () => ({
        update: updateComponent,
      }),
      [],
    );

    return null;
  },
);

export default memo(ElementRoot);
