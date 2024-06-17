import { ReactNode, memo, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import Element from '@components/Factory/Element';

export interface ContainerProps {
  children: ReactNode;
  attributes?: { [key: string]: any };
}

const Container = memo<ContainerProps>(({ children, attributes }) => {
  const [svgRef, setSvgRef] = useState<SVGElement | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(children);

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation?.addedNodes?.length > 0) {
          setIsReady(true);
          observer.disconnect();
        }
      });
    });

    observer.observe(container, { childList: true });

    return () => {
      root.unmount();
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {isReady && (
        <svg ref={setSvgRef} {...attributes}>
          <Element container={svgRef}>{children}</Element>
        </svg>
      )}
    </>
  );
});

export default Container;
