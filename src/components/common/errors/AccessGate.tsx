import React from 'react';
import { AdminLinksKey, FeatureGate } from 'src/components/common/FeatureGate';
import { lazyWithRetry } from 'src/services/lazyWithRetry';

const AccessDeniedView = lazyWithRetry(
  () => import('src/views/accessDenied/AccessDenied'),
);

const TrialEndedView = lazyWithRetry(
  () => import('src/views/trialEnded/TrialEnded'),
);

interface Props {
  children: React.ReactNode;
}

export const AccessGate = ({ children }: Props) => {
  return (
    <FeatureGate
      fallback={
        <FeatureGate
          fallback={<AccessDeniedView />}
          anyLinkName={
            ['boclipsWebAppAccess', 'classroomWebAppAccess'] as AdminLinksKey[]
          }
        >
          <>{children}</>
        </FeatureGate>
      }
      anyLinkName={['reportAccessExpired'] as AdminLinksKey[]}
    >
      <TrialEndedView />
    </FeatureGate>
  );
};
