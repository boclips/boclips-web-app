import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const RedirectFromSparksToAlignments = () => {
  const { pathname } = useLocation();

  const isSparksPath = pathname.startsWith('/sparks');
  const updatedPath = pathname.replace('sparks', 'alignments');

  return isSparksPath ? (
    <Navigate to={{ pathname: updatedPath }} replace />
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
};
