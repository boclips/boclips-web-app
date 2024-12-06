import React from 'react';
import SkipLink from '@components/skipLink/SkipLink';
import LibraryLogoSVG from '@resources/icons/library-logo.svg?react';
import ClassroomLogoSVG from '@resources/icons/classroom-logo.svg?react';
import c from 'classnames';
import s from './style.module.less';

interface Props {
  product?: 'CLASSROOM' | 'LIBRARY';
}

const InvisibleNavbar = ({ product = 'LIBRARY' }: Props) => {
  const logoSvg =
    product === 'CLASSROOM' ? (
      <ClassroomLogoSVG className={s.logo} data-qa="classroom-logo" />
    ) : (
      <LibraryLogoSVG className={s.logo} data-qa="library-logo" />
    );

  return (
    <nav
      className={c(
        'col-start-2 col-end-26 row-start-1 row-end-1',
        s.invisibleNavbar,
      )}
    >
      {logoSvg}
      <span className={s.skipLinkContainer}>
        <SkipLink />
      </span>
    </nav>
  );
};

export default InvisibleNavbar;
