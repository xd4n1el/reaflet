import { create } from 'zustand';
import { FullScreenHandle } from 'react-full-screen';

export interface FullscreenStore {
  handler?: FullScreenHandle;
  addController: (controller: FullScreenHandle) => void;
  removeController: () => void;
}

export const useFullscreenStore = create<FullscreenStore>(set => ({
  handler: undefined,
  addController: (controller: FullScreenHandle) => set({ handler: controller }),
  removeController: () => set({ handler: undefined }),
}));
