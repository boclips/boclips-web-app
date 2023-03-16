import React from 'react';
import { HashLink } from 'react-router-hash-link';
import s from './style.module.less';

interface PageLinkProps {
  themeId: string;
  hash: string;
  children: React.ReactElement[];
}
export const PaginationLink = ({ themeId, hash, children }: PageLinkProps) => (
  <HashLink
    scroll={() => {}}
    to={{
      pathname: `/explore/openstax/${themeId}`,
      hash,
    }}
    className={s.sectionLink}
  >
    {children}
  </HashLink>
);
