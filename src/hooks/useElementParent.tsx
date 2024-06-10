import { useContext } from 'react';

import ParentContext from '@context/Parent';

export const useElementParent = () => {
  const parent = useContext(ParentContext);

  return parent;
};
