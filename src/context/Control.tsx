import { Position } from '@/components/Control/Container/Factory';
import { ReactElement, ReactNode, createContext } from 'react';

export interface ControlContextOptions {
  position?: Position;
}

const ControlContext = createContext({
  position: undefined,
} as ControlContextOptions);

interface ParentProviderProps {
  children: ReactNode;
  value: ControlContextOptions;
}

export const ControlProvider = ({
  children,
  value,
}: ParentProviderProps): ReactElement => {
  return (
    <ControlContext.Provider value={value}>{children}</ControlContext.Provider>
  );
};

export default ControlContext;
