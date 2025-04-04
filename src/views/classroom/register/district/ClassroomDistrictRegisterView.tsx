import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import { Helmet } from 'react-helmet';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import InvisibleNavbar from 'src/components/common/invisibleNavbar/InvisibleNavbar';
import { DistrictRegistration } from 'src/components/classroom/registration/district/DistrictRegistration';

const ClassroomDistrictRegistrationView = () => {
  const breakpoints = useMediaBreakPoint();
  const isMobileView =
    breakpoints.type === 'mobile' || breakpoints.type === 'tablet';
  return (
    <>
      <Helmet title="District Register" />
      <Layout
        rowsSetup="grid-rows-registration-view"
        responsiveLayout
        backgroundColor={!isMobileView && '#F9FBFF'}
      >
        <InvisibleNavbar product="CLASSROOM" />
        <DistrictRegistration />
      </Layout>
    </>
  );
};

export default ClassroomDistrictRegistrationView;
