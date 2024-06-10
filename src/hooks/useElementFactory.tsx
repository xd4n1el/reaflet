import { useEffect, useRef, useState } from 'react';
import { useElementParent } from '@hooks/useElementParent';

// just a helper
export interface Constructor<T> {
  new (...args: any[]): T;
}

export interface AfterCreationCallback<I = any> {
  instance: I;
}

export interface Validation {
  containerIsRequired?: boolean;
}

export interface Return<E = any> {
  element?: E;
}

export interface UseElementFactoryHook<
  /** Factory type */
  T,
  U extends any[], // args types array
> {
  /** The constructor of the element that should be built. */
  Factory: Constructor<T>;
  /** The constructor arguments array, should be passed in the order required by the constructor. */
  options: U;
  /** Component validator, this is a helper to keep the element clean. */
  validation?: Validation;
  afterCreation?: (instance: T) => void;
}

/**
 * `@recommended` Hook that create the leaflet instance, also provide some validations to provided constructor.
 *
 * TS helper in order:
 *
 *
 * 1°: `Constructor type`.
 *
 * 2°: `Constructor args type: array of values`.
 *
 * returns the element of constructor provided.
 */
export const useElementFactory = <T, U extends any[]>({
  Factory,
  options,
  validation,
  afterCreation,
}: UseElementFactoryHook<T, U>): Return<T> => {
  const [element, setElement] = useState<T | undefined>();

  const isReady = useRef<boolean>(false); // workaround to not rerender and more faster approach

  const { container } = useElementParent();

  useEffect(() => {
    if (isReady?.current) return;

    const { containerIsRequired } = validation || {};

    if (containerIsRequired && !container) return;

    const instance = new Factory(...options);

    if (afterCreation) afterCreation(instance);

    setElement(instance);

    isReady.current = true;
  }, [options, container, validation]);

  return { element };
};
