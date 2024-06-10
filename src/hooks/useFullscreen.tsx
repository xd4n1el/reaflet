import { useFullscreenStore } from '@store/fullscreen';

export const useFullscreen = () => {
  const { addController, removeController, handler } = useFullscreenStore();

  const { active, ...rest } = handler || {};

  return {
    ...rest,
    isActive: active,
    addController,
    removeController,
  };
};
