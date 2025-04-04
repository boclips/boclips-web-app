import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import { Helmet } from 'react-helmet';
import { ClassroomRegistration } from 'src/components/classroom/registration/user/ClassroomRegistration';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import InvisibleNavbar from 'src/components/common/invisibleNavbar/InvisibleNavbar';

const ClassroomRegistrationView = () => {
  const breakpoints = useMediaBreakPoint();
  const isMobileView =
    breakpoints.type === 'mobile' || breakpoints.type === 'tablet';
  return (
    <>
      <Helmet title="Register" />
      <Layout
        rowsSetup="grid-rows-registration-view"
        responsiveLayout
        backgroundColor={!isMobileView && '#F9FBFF'}
      >
        <InvisibleNavbar product="CLASSROOM" />
        <ClassroomRegistration />
      </Layout>
    </>
  );
};

export default ClassroomRegistrationView;
