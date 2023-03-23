import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const RedirectFromExploreToSparks = () => {
  const { pathname, hash } = useLocation();

  const isExplorePath = pathname.startsWith('/explore');
  const updatedPath = pathname.replace('explore', 'sparks');
  const updatedHash = hash
    .replace('chapter', 'topic')
    .replace('section', 'target');

  return isExplorePath ? (
    <Navigate to={{ pathname: updatedPath, hash: updatedHash }} replace />
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
};
