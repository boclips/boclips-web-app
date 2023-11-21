import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import React from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import Footer from 'src/components/layout/Footer';
import { Helmet } from 'react-helmet';

const MyAccountView = () => {
  return (
    <>
      <Helmet title="My Account" />
      <Layout rowsSetup="my-account-view" responsiveLayout>
        <Navbar />
        <PageHeader title="My Dashboard" />
        <main
          tabIndex={-1}
          className="col-start-2 col-end-26 row-start-3 row-end-4 flex items-start"
        />
        <Footer />
      </Layout>
    </>
  );
};

export default MyAccountView;
