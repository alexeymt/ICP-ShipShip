/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject, useCallback, useEffect } from 'react';

interface UseOutsideClickParams {
  ref: RefObject<HTMLInputElement>;
  fn: () => void;
}

export const useOutsideClick = ({ ref, fn }: UseOutsideClickParams): any => {
  const handleClickOutside = useCallback(
    (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        // event.stopPropagation();
        // event.preventDefault();
        fn();
      }
    },
    [fn, ref],
  );
  useEffect(() => {
    // Bind the event listener
    document.addEventListener('click', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, fn, handleClickOutside]);
};
