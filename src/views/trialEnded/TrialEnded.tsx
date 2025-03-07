import { Layout } from 'src/components/layout/Layout';
import { EmptyNavbar } from 'src/components/layout/EmptyNavbar';
import Footer from 'src/components/layout/Footer';
import React, { useEffect } from 'react';
import { Hero } from 'src/components/hero/Hero';
import TrialEndedSVG from 'src/resources/icons/trial-ended.svg';
import Button from '@boclips-ui/button';
import { Helmet } from 'react-helmet';
import { usePlatformInteractedWithEvent } from 'src/hooks/usePlatformInteractedWithEvent';

const TrialEnded = () => {
  const { mutate: trackEvent } = usePlatformInteractedWithEvent();

  useEffect(() => {
    trackEvent({
      subtype: 'CLASSROOM_TRIAL_EXPIRED_SCREEN_VIEWED',
      anonymous: false,
    });
  }, [trackEvent]);

  return (
    <Layout rowsSetup="grid-rows-home">
      <Helmet title="Trial Ended!" />
      <EmptyNavbar />
      <Hero
        icon={<TrialEndedSVG />}
        title="Your Boclips Classroom Trial has Expired"
        description={
          <>
            <p className="mb-2">
              WWe hope you enjoyed your Boclips Classroom trial and found it
              enriching and beneficial to your teaching and learning experience!
            </p>
            <p>
              To regain access and explore options to bring Boclips Classroom to
              your school or district, please schedule a free consultation.
              Don’t worry — we’ll save your playlists for you until you come
              back!
            </p>
          </>
        }
        actions={
          <Button
            onClick={() => {
              window.location.href = 'https://www.boclips.com/contact';
            }}
            text="Schedule Free Consultation"
          />
        }
      />
      <Footer />
    </Layout>
  );
};

export default TrialEnded;
