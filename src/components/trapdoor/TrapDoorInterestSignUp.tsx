import React from 'react';
import { Hero } from 'src/components/hero/Hero';
import Button from '@boclips-ui/button';
import NotFoundSVG from 'src/resources/icons/not-found.svg';
import { useGetUserQuery, useUpdateSelfUser } from 'src/hooks/api/userQuery';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';

interface Props {
  feature: string;
}

export const TrapDoorInterestSignUp = ({ feature }: Props) => {
  const { data: user, isLoading: userIsLoading } = useGetUserQuery();
  const { mutate: updateSelfUser } = useUpdateSelfUser();

  const interestSignUp = () => {
    AnalyticsFactory.pendo().trackTrapDoorSignUp(feature);
    console.log(`User ${user.email} signed up for ${feature}`);
    // updateSelfUser({ user, request: {} });
    // TODO do we want to handle this via a user update or a dedicated endpoint?
  };

  return (
    <Hero
      icon={<NotFoundSVG />}
      title="Feature not available yet!"
      description="Sorry, that feature isn't available yet. Sign up to our waitlist to register your interest"
      actions={
        <Button
          onClick={interestSignUp}
          disabled={userIsLoading}
          text="Sign up for waitlist"
        />
      }
    />
  );
};
