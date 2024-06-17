/**
 * Funciton to compare objects, usefull to Component props
 *
 * TS Helper
 *
 * 1° Object type
 */

import { DomUtil } from 'leaflet';

/* eslint-disable no-prototype-builtins */
export const compareObjects = <T extends Record<string, any>>(
  object: T,
  comparator: T,
): Partial<T> => {
  const res: Partial<T> = {};

  for (const key in object) {
    // eslint-disable-next-line no-prototype-builtins
    if (object.hasOwnProperty(key)) {
      if (object[key] !== comparator[key]) {
        res[key] = comparator[key];
      }
    }
  }

  return res;
};

export interface FilterProperties<T> {
  object: T;
  map: string[];
  /**@default false */
  keepNullishValue?: boolean;
  /** this prop keep the whitelist even when map array is empty */
  whitelist?: boolean;
}

/**
 * Funciton to filter properties in objects, usefull to Component props
 *
 * TS Helper
 *
 * 1° Object type
 */
export const filterProperties = <T>({
  object,
  map,
  keepNullishValue,
  whitelist = false,
}: FilterProperties<T>): Partial<T> => {
  const result: Partial<T> = {};

  if (map?.length === 0 && !whitelist) return object;

  for (const key in object) {
    if (map.includes(key)) {
      if (!keepNullishValue && object[key] == null) continue;
      result[key] = object[key];
    }
  }

  return result;
};

/**
 * Funciton to remove properties in objects, usefull to Component props
 *
 * TS Helper
 *
 * 1° Object type
 */
export const excludeProperties = <T>(
  object: T,
  keys: (keyof T)[],
): Partial<T> => {
  const newObject = { ...object };

  keys.forEach(key => {
    delete newObject[key];
  });

  return newObject;
};

/**
 * Funciton to remove the events of a Component props
 *
 * use `@on` notation before Events to work
 * @returns a new object without event in props
 */
export const excludeEvents = <T extends Record<string, any>>(
  object: T,
): Partial<T> => {
  const result: Partial<T> = {};
  for (const key in object) {
    if (
      object.hasOwnProperty(key) &&
      !(key.startsWith('on') && key.charAt(2) === key.charAt(2).toUpperCase())
    ) {
      result[key] = object[key];
    }
  }
  return result;
};

/**
 * Funciton to rename properties in objects, usefull to Component props
 *
 * TS Helper
 *
 * 1° Object type
 */
export const renameProperties = <
  T extends Record<string, any>,
  U extends Record<string, any>,
>(
  object: T,
  mapping: Partial<Record<keyof T, keyof U>>,
): U => {
  const result: Partial<U> = {};

  for (const key in object) {
    if (object?.hasOwnProperty(key)) {
      const newKey = mapping[key]!;

      result[newKey || key] = object[key];
    }
  }

  return result as U;
};

export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  if (array?.length === 0 || typeof chunkSize !== 'number') return [];

  const chunks: T[][] = [];
  const totalChunks = Math.ceil(array.length / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const startIndex = i * chunkSize;
    const endIndex = Math.min((i + 1) * chunkSize, array.length);

    const chunk: T[] = array.slice(startIndex, endIndex);

    chunks.push(chunk);
  }

  return chunks;
};

export const validateNodeClasses = (
  prev: string,
  next: string,
  node: HTMLElement,
): void => {
  const isValid = (arg?: string) => arg && typeof arg === 'string';

  if (!isValid(prev) || !isValid(next) || !node) return;

  const prevClasses = prev!.split(' ');
  const nextClasses = next!.split(' ');

  prevClasses.forEach((value: string) => {
    if (!nextClasses.includes(value)) {
      DomUtil.removeClass(node, value);
    }
  });

  nextClasses.forEach((value: string) => {
    if (!prevClasses.includes(value)) {
      DomUtil.addClass(node, value);
    }
  });
};
