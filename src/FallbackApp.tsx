import React from 'react';
import { Helmet } from 'react-helmet';
import { Loading } from './components/common/Loading';

const FallbackView = React.lazy(() => import('./views/fallback/FallbackView'));

export const FallbackApp = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <Helmet title="Library" />
      <FallbackView />
    </React.Suspense>
  );
};
