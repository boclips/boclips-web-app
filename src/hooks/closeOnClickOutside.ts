import React, { useEffect } from 'react';

export default function CloseOnClickOutside(
  ref: React.MutableRefObject<any>,
  closeOnClickOutsideFn: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (closeOnClickOutsideFn) {
          closeOnClickOutsideFn();
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, closeOnClickOutsideFn]);
}
