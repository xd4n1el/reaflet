import {
  ReactElement,
  ReactNode,
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import { PointExpression } from 'leaflet';
import DivIconFactory, { DivIconOptions } from './Factory';
import ElementPortal, {
  ElementPortalRef,
} from '@components/Factory/ElementPortal';

import { renameProperties } from '@utils/functions';

interface CustomDivIconProps {
  size?: PointExpression;
  anchor?: PointExpression;
  src?: string;
  retinaURL?: string;
  shadowURL?: string;
  children?: ReactNode;
}

type ValidDivIconOptions = Omit<
  DivIconOptions,
  'html' | 'iconUrl' | 'iconAnchor' | 'iconSize' | 'iconRetinaUrl' | 'shadowUrl'
>;

export type DivIconProps = CustomDivIconProps & ValidDivIconOptions;
export type DivIconRef = DivIconFactory;

const DivIcon = memo(
  forwardRef<DivIconRef, DivIconProps>(
    ({ children, ...rest }, ref): ReactElement => {
      const elementPortalRef = useRef<ElementPortalRef>(null);

      const renamedProps = useMemo(() => {
        const map: Partial<Record<keyof DivIconProps, keyof DivIconOptions>> = {
          src: 'iconUrl',
          size: 'iconSize',
          anchor: 'iconAnchor',
          shadowURL: 'shadowUrl',
          retinaURL: 'iconRetinaUrl',
        };

        return renameProperties<DivIconProps, DivIconOptions>(rest, map);
      }, [rest]);

      const { element } = useElementFactory<DivIconFactory, [DivIconOptions]>({
        Factory: DivIconFactory,
        options: [renamedProps],
      });
      useElementLifeCycle<any, DivIconFactory>({
        element,
        beforeAdd({ container }) {
          if (!container) return;

          const node: any = container?.getElement();
          const elementClassList = Array.from(node?.classList || {});

          return elementClassList;
        },
        afterAdd({ container }, response) {
          if (!container) return;

          const node: any = container?.getElement();

          node?.setAttribute('class', response?.join(' '));

          setTimeout(() => {
            elementPortalRef.current?.update();
          }, 0);
        },
      });
      useElementUpdate<DivIconFactory, DivIconProps>({
        element,
        props: renamedProps,
        handlers: {
          allProps(prevValues, nextValues, instance) {
            instance.setOptions(nextValues);
          },
        },
      });
      useImperativeHandle(ref, () => element!, [element]);

      return (
        <ElementPortal ref={elementPortalRef} element={element}>
          {children}
        </ElementPortal>
      );
    },
  ),
);

export default DivIcon;
