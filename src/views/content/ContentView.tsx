import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import PageHeader from 'src/components/pageTitle/PageHeader';
import { Hero as ContentEmptyPlaceholderState } from 'src/components/hero/Hero';
import PlaceholderSvg from 'src/resources/icons/empty-order-history.svg';
import Footer from 'src/components/layout/Footer';
import { Helmet } from 'react-helmet';

const ContentView = () => {
  return (
    <>
      <Helmet title="My content" />
      <Layout rowsSetup="grid-rows-content-view" responsiveLayout>
        <Navbar />
        <PageHeader title="My content" />
        <ContentEmptyPlaceholderState
          row="3"
          icon={<PlaceholderSvg />}
          title="You have no licensed content... yet!"
          description="This is just a placeholder"
        />
        <Footer />
      </Layout>
    </>
  );
};

export default ContentView;
