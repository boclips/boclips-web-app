import React from 'react';
import Navbar from '@components/layout/Navbar';
import { Layout } from '@components/layout/Layout';
import Footer from '@components/layout/Footer';
import { AlignmentWidget } from '@components/alignments/widget/AlignmentWidget';
import { Helmet } from 'react-helmet';

const AlignmentsView = () => {
  return (
    <Layout rowsSetup="grid-rows-homepage" responsiveLayout>
      <Navbar />
      <Helmet title="Alignments" />
      <AlignmentWidget />
      <Footer className="col-start-2 col-end-26" />
    </Layout>
  );
};

export default AlignmentsView;
