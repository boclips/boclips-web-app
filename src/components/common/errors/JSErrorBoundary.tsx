import React from 'react';
import * as Sentry from '@sentry/react';
import { FallbackRender } from '@sentry/react/dist/errorboundary';

interface Props {
  fallback: React.ReactElement | FallbackRender;
  children: React.ReactNode;
}

export const JSErrorBoundary = ({ children, fallback }: Props) => {
  return (
    <Sentry.ErrorBoundary fallback={fallback}>{children}</Sentry.ErrorBoundary>
  );
};
