import React from 'react';
import { Hero } from 'src/components/hero/Hero';
import Button from '@boclips-ui/button';
import BuildSVG from 'src/resources/icons/build.svg';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { displayNotification } from 'src/components/common/notification/displayNotification';

interface Props {
  feature: string;
}

export const TrapDoorInterestSignUp = ({ feature }: Props) => {
  const interestSignUp = () => {
    AnalyticsFactory.pendo().trackTrapDoorSignUp(feature);
    displayNotification(
      'success',
      `Successfully added to waitlist`,
      '',
      `sign-up-for-${feature}`,
    );
  };

  return (
    <Hero
      icon={<BuildSVG />}
      title="Thank you for your interest!"
      description="Sorry, this feature isn't available yet. Join the waitlist to hear future updates."
      actions={<Button onClick={interestSignUp} text="Join waitlist" />}
    />
  );
};
