import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { Helmet } from 'react-helmet';

const RegistrationView = () => {
  return (
    <>
      <Helmet title="Register" />
      <Layout rowsSetup="grid-rows-registration-view" responsiveLayout>
        <Navbar />
        <section className="col-start-7 col-end-15">Register now!</section>
        <Footer className="col-start-2 col-end-26" />
      </Layout>
    </>
  );
};

export default RegistrationView;
