import React from 'react';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { Helmet } from 'react-helmet';
import RegistrationForm from 'src/components/registration/RegistrationForm';

const RegisterView = () => {
  return (
    <>
      <Helmet title="Register" />
      <Layout rowsSetup="grid-rows-registration-view" responsiveLayout>
        <RegistrationForm />
        <Footer className="col-start-2 col-end-26 row-start-6" />
      </Layout>
    </>
  );
};

export default RegisterView;
