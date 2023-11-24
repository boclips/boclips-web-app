import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import { Layout } from 'src/components/layout/Layout';
import Footer from 'src/components/layout/Footer';
import { AlignmentWidget } from 'src/components/alignments/widget/AlignmentWidget';

const AlignmentsView = () => {
  return (
    <Layout rowsSetup="grid-rows-homepage" responsiveLayout>
      <Navbar />
      <AlignmentWidget />
      <Footer className="col-start-2 col-end-26" />
    </Layout>
  );
};

export default AlignmentsView;
