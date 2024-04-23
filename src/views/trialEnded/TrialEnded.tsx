import { Layout } from 'src/components/layout/Layout';
import { EmptyNavbar } from 'src/components/layout/EmptyNavbar';
import Footer from 'src/components/layout/Footer';
import React from 'react';
import { Hero } from 'src/components/hero/Hero';
import TrialEndedSVG from 'src/resources/icons/trial-ended.svg';
import Button from '@boclips-ui/button';
import { Helmet } from 'react-helmet';
import { usePlatformInteractedWithEvent } from 'src/hooks/usePlatformInteractedWithEvent';

const TrialEnded = () => {
  const { mutate: trackEvent } = usePlatformInteractedWithEvent();
  trackEvent({
    subtype: 'CLASSROOM_TRIAL_EXPIRED_SCREEN_VIEWED',
    anonymous: false,
  });

  return (
    <Layout rowsSetup="grid-rows-home">
      <Helmet title="Trial Ended!" />
      <EmptyNavbar />
      <Hero
        icon={<TrialEndedSVG />}
        title="Your free trial has ended!"
        description={
          <>
            <p className="mb-2">
              We hope that you’ve enjoyed the last 60 days of free access to
              Boclips Classroom and found lots of exciting content to
              collaborate with colleagues on and share with your students.
            </p>
            <p>
              Your access has now expired but we’ve kept all your saved
              playlists and videos safe, just as you left them. Talk to us now
              to regain access and to discuss getting Boclips Classroom at your
              school.
            </p>
          </>
        }
        actions={
          <Button
            onClick={() => {
              window.location.href = 'https://www.boclips.com/contact';
            }}
            text="Get Boclips Classroom at your school"
          />
        }
      />
      <Footer />
    </Layout>
  );
};

export default TrialEnded;
