import React from 'react';
import { HashLink } from 'react-router-hash-link';
import c from 'classnames';
import s from './style.module.less';

interface PageLinkProps {
  bookId: string;
  hash: string;
  children: React.ReactElement[];
}
export const PaginationLink = ({ bookId, hash, children }: PageLinkProps) => (
  <HashLink
    scroll={() => {}}
    to={{
      pathname: `/explore/openstax/${bookId}`,
      hash,
    }}
    className={c('flex', s.sectionLink)}
  >
    {children}
  </HashLink>
);
