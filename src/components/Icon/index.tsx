import { forwardRef, memo, useImperativeHandle, useMemo } from 'react';
import { useElementLifeCycle } from '@hooks/useElementLifeCycle';
import { useElementFactory } from '@hooks/useElementFactory';
import { useElementUpdate } from '@hooks/useElementUpdate';

import { PointExpression } from 'leaflet';
import IconFactory, { IconOptions, ImageLoading } from './Factory';

import { renameProperties } from '@utils/functions';

interface CustomIconProps {
  size?: PointExpression;
  anchor?: PointExpression;
  src?: string;
  retinaURL?: string;
  shadowURL?: string;
  loading?: ImageLoading;
}

type ValidIconOptions = Omit<
  IconOptions,
  'iconUrl' | 'iconAnchor' | 'iconSize' | 'iconRetinaUrl' | 'shadowUrl'
>;

export type IconProps = CustomIconProps & ValidIconOptions;
export type IconRef = IconFactory;

const Icon = memo(
  forwardRef<IconRef, IconProps>((props, ref) => {
    const renamedProps = useMemo(() => {
      const map: Partial<Record<keyof IconProps, keyof IconOptions>> = {
        src: 'iconUrl',
        size: 'iconSize',
        anchor: 'iconAnchor',
        shadowURL: 'shadowUrl',
        retinaURL: 'iconRetinaUrl',
      };

      return renameProperties<IconProps, IconOptions>(props, map);
    }, [props]);

    const { element } = useElementFactory<IconFactory, [IconOptions]>({
      Factory: IconFactory,
      options: [renamedProps],
    });
    useElementUpdate<IconFactory, IconProps>({
      element,
      props: renamedProps,
      handlers: {
        src(prevValue, nextValue, instance) {
          instance.setImage(nextValue as string);
        },
        allProps(prevValues, nextValues, instance) {
          instance.setOptions(nextValues as IconOptions);
        },
      },
    });
    useElementLifeCycle<any, IconFactory>({
      element,
      beforeAdd({ container }) {
        if (!container) return;

        const node = container?.getElement();

        return Array.from(node?.classList || {});
      },
      afterAdd({ container }, response) {
        if (!container) return;

        const node = container?.getElement();

        node?.setAttribute('class', response.join(' '));
      },
    });
    useImperativeHandle(ref, () => element!, [element]);

    return null;
  }),
);

export default Icon;
