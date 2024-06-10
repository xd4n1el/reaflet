import { useContext } from 'react';

import ControlContext from '@context/Control';

export const useControl = () => {
  const control = useContext(ControlContext);

  return control;
};
