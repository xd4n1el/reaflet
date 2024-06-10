import { ReactNode, memo } from 'react';
import { ParentContextOptions, ParentProvider } from '@context/Parent';

export interface ElementProps<C = any> extends ParentContextOptions<C> {
  children?: ReactNode;
  container: any;
  preventUnmount?: boolean;
}

const Element = memo<ElementProps>(
  ({ container, children, preventUnmount = false }): ReactNode => {
    if (!container) return null;

    return (
      <ParentProvider value={{ container, preventUnmount }}>
        {children}
      </ParentProvider>
    );
  },
);

export default Element;
