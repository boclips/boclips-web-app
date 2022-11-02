import { Helmet } from 'react-helmet';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import React from 'react';
import { DashboardHeader } from 'src/components/dashboard/DashboardHeader';

const DashboardView = () => {
  return (
    <>
      <Helmet title="Dashboard" />
      <Layout rowsSetup="grid-rows-library-view" responsiveLayout>
        <Navbar />
        <DashboardHeader />
        <Footer columnPosition="col-start-2 col-end-26" />
      </Layout>
    </>
  );
};

export default DashboardView;
