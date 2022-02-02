import React from 'react';
import { useGlobalQueryError } from '../providers/GlobalQueryErrorProvider';

interface Props {
  fallback: any;
  children: React.ReactNode;
}

export const QueryErrorBoundary = ({ fallback, children }: Props) => {
  const { isError } = useGlobalQueryError();

  if (isError) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
