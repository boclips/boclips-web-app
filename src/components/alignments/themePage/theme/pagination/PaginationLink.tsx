import React from 'react';
import { Link } from 'react-router-dom';
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
    <Link
      to={{
        pathname: `/alignments/${provider.navigationPath}/${themeId}`,
        hash,
      }}
      className={s.targetLink}
    >
      {children}
    </Link>
  );
};
