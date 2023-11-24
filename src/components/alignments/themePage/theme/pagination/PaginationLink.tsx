import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { useAlignmentProvider } from 'src/components/common/providers/AlignmentContextProvider';
import s from './style.module.less';

interface PageLinkProps {
  themeId: string;
  hash: string;
  children: React.ReactElement[];
}
export const PaginationLink = ({ themeId, hash, children }: PageLinkProps) => {
  const provider = useAlignmentProvider();

  return (
    <HashLink
      scroll={() => {}}
      to={{
        pathname: `/sparks/${provider.navigationPath}/${themeId}`,
        hash,
      }}
      className={s.targetLink}
    >
      {children}
    </HashLink>
  );
};
