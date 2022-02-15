import { PageNotFoundError } from 'src/components/common/errors/pageNotFound/PageNotFoundError';
import RefreshPageError from 'src/components/common/errors/refreshPageError/RefreshPageError';
import React from 'react';

interface Props {
  isVideoNotFound: boolean;
}

export const Fallback = ({ isVideoNotFound }: Props) => {
  return isVideoNotFound ? <PageNotFoundError /> : <RefreshPageError />;
};
