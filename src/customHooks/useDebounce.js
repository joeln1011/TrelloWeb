import { useCallback } from 'react';
import { debounce } from 'lodash';

export const useDebounce = (fnToDebounce, delay = 500) => {
  if (isNaN(delay)) {
    throw new Error('Delay value must be a number');
  }
  if (!fnToDebounce || typeof fnToDebounce !== 'function') {
    throw new Error('Debounce must have a function');
  }

  // useCallback is used to memoize the debounced function
  // so that it does not get recreated on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(fnToDebounce, delay), [fnToDebounce, delay]);
};
