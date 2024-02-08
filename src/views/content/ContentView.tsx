import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import PageHeader from 'src/components/pageTitle/PageHeader';
import { Hero as ContentEmptyPlaceholderState } from 'src/components/hero/Hero';
import PlaceholderSvg from 'src/resources/icons/empty-order-history.svg';
import Footer from 'src/components/layout/Footer';
import { Helmet } from 'react-helmet';
import { useLicensedContentQuery } from 'src/hooks/api/licensedContentQuery';
import MyContentArea from 'src/components/MyContentArea/MyContentArea';

const ContentView = () => {
  const { data: licensedContent } = useLicensedContentQuery();
  const hasLicensedContent = licensedContent?.length > 0;
  return (
    <>
      <Helmet title="My Content Area" />
      <Layout rowsSetup="grid-rows-content-view" responsiveLayout>
        <Navbar />
        <PageHeader title="My Content Area" />
        {hasLicensedContent ? (
          <MyContentArea licensedContent={licensedContent} />
        ) : (
          <ContentEmptyPlaceholderState
            row="3"
            icon={<PlaceholderSvg />}
            title="You have no licensed content... yet!"
            description="This is just a placeholder"
          />
        )}
        <Footer />
      </Layout>
    </>
  );
};

export default ContentView;
