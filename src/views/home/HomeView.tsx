import React from 'react';
import DisciplinesWidget from 'src/components/disciplinesWidget/DisciplinesWidget';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';

const HomeView = () => {
  return (
    <Layout rowsSetup="grid-rows-homepage" responsiveLayout>
      <Navbar />
      <DisciplinesWidget />
      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default HomeView;
