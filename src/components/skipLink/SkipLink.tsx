import React, { useEffect, useRef, useState } from 'react';
import c from 'classnames';
import { Button } from 'boclips-ui';
import s from './style.module.less';

const SkipLink = () => {
  const [focus, setFocus] = useState<boolean>();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('focus', () => {
        setFocus(true);
      });

      ref.current.addEventListener('focusout', () => {
        setFocus(false);
      });
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('focus', () => {
          setFocus(true);
        });

        ref.current.removeEventListener('focusout', () => {
          setFocus(false);
        });
      }
    };
  }, [ref.current]);

  return (
    <div className={c(s.skipToContent, { [s.focused]: focus })}>
      <Button
        ref={ref}
        data-qa="skip_to_content"
        onClick={() =>
          document.querySelector('main').focus({ preventScroll: false })
        }
        text="Skip to content"
        width="154px"
        height="48px"
      />
    </div>
  );
};

export default SkipLink;
