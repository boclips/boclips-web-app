import React from 'react';
import { Layout } from '@src/components/layout/Layout';
import { Helmet } from 'react-helmet';
import { Registration } from '@src/components/registration/Registration';
import { useMediaBreakPoint } from 'boclips-ui';
import InvisibleNavbar from '@src/components/common/invisibleNavbar/InvisibleNavbar';

const RegistrationView = () => {
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
        <InvisibleNavbar product="LIBRARY" />
        <Registration />
      </Layout>
    </>
  );
};

export default RegistrationView;
