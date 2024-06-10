import { ReactElement, ReactNode, createContext } from 'react';

export interface ParentContextOptions<C = any> {
  container: C;
  preventUnmount?: boolean;
}

const ParentContext = createContext({
  container: undefined,
} as ParentContextOptions);

interface ParentProviderProps {
  children: ReactNode;
  value: ParentContextOptions;
}

export const ParentProvider = ({
  children,
  value,
}: ParentProviderProps): ReactElement => {
  return (
    <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
  );
};

export default ParentContext;
