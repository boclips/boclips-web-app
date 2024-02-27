import React from 'react';
import SkipLink from 'src/components/skipLink/SkipLink';
import LibraryLogoSVG from 'src/resources/icons/library-logo.svg';
import c from 'classnames';
import s from './style.module.less';

const InvisibleNavbar = () => {
  return (
    <nav
      className={c(
        'col-start-2 col-end-26 row-start-1 row-end-1',
        s.invisibleNavbar,
      )}
    >
      <LibraryLogoSVG className={s.logo} data-qa="logo" />

      <span className={s.skipLinkContainer}>
        <SkipLink />
      </span>
    </nav>
  );
};

export default InvisibleNavbar;
