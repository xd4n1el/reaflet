import { forwardRef, memo, useImperativeHandle, useState } from 'react';

import ZoomIn, { ZoomInButtonProps, ZoomInButtonRef } from './ZoomIn';
import ZoomOut, { ZoomOutButtonProps, ZoomOutButtonRef } from './ZoomOut';

export interface ZoomProps {
  zoomInBtn?: ZoomInButtonProps;
  zoomOutBtn?: ZoomOutButtonProps;
}

export interface ZoomRef {
  zoomInBtn?: ZoomInButtonRef | null;
  zoomOutBtn?: ZoomOutButtonRef | null;
}

const Zoom = forwardRef<ZoomRef, ZoomProps>(
  ({ zoomInBtn, zoomOutBtn }, ref) => {
    const [zoomInBtnRef, setZoomInBtnRef] = useState<ZoomInButtonRef | null>(
      null,
    );
    const [zoomOutBtnRef, setZoomOutBtnRef] = useState<ZoomOutButtonRef | null>(
      null,
    );

    useImperativeHandle(
      ref,
      () => ({
        zoomInBtn: zoomInBtnRef,
        zoomOutBtn: zoomOutBtnRef,
      }),
      [zoomInBtnRef, zoomOutBtnRef],
    );

    return (
      <>
        <ZoomIn {...zoomInBtn} ref={setZoomInBtnRef} />

        <ZoomOut {...zoomOutBtn} ref={setZoomOutBtnRef} />
      </>
    );
  },
);

export default memo(Zoom);
