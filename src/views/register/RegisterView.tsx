import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import { Helmet } from 'react-helmet';
import { RegistrationProcess } from 'src/components/registration/RegistrationProcess';
import TrialInfo from 'src/components/registration/trialInfo/TrialInfo';

const RegistrationView = () => {
  return (
    <>
      <Helmet title="Register" />
      <Layout
        rowsSetup="grid-rows-registration-view"
        responsiveLayout
        backgroundColor="#F9FBFF"
      >
        <TrialInfo />
        <RegistrationProcess />
      </Layout>
    </>
  );
};

export default RegistrationView;
