import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import { Helmet } from 'react-helmet';
import { Registration } from 'src/components/registration/Registration';
import InvisibleNavbar from 'src/components/registration/invisibleNavbar/InvisibleNavbar';

const RegistrationView = () => {
  return (
    <>
      <Helmet title="Register" />
      <Layout
        rowsSetup="grid-rows-registration-view"
        responsiveLayout
        backgroundColor="#F9FBFF"
      >
        <InvisibleNavbar />
        <Registration />
      </Layout>
    </>
  );
};

export default RegistrationView;
