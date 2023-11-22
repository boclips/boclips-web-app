import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import { Helmet } from 'react-helmet';
import { RegistrationProcess } from 'src/components/registration/RegistrationProcess';
import Navbar from 'src/components/layout/Navbar';

const RegistrationView = () => {
  return (
    <>
      <Helmet title="Register" />
      <Layout
        rowsSetup="grid-rows-registration-view"
        responsiveLayout
        backgroundColor="#F5F5F5"
      >
        <Navbar showSearch={false} showOptions={false} />
        <RegistrationProcess />
      </Layout>
    </>
  );
};

export default RegistrationView;
