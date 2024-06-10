import { memo } from 'react';
import ZoomIn from './ZoomIn';
import ZoomOut from './ZoomOut';

const Zoom = memo(() => {
  return (
    <>
      <ZoomIn />
      <ZoomOut />
    </>
  );
});

export default Zoom;
