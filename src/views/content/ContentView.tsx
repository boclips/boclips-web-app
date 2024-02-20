import React, { useState } from 'react';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import PageHeader from 'src/components/pageTitle/PageHeader';
import { Hero as ContentEmptyPlaceholderState } from 'src/components/hero/Hero';
import EmptyContentSVG from 'src/resources/icons/empty-content.svg';
import Footer from 'src/components/layout/Footer';
import { Helmet } from 'react-helmet';
import { useLicensedContentQuery } from 'src/hooks/api/licensedContentQuery';
import MyContentArea from 'src/components/MyContentArea/MyContentArea';

const PAGE_SIZE = 10;

const ContentView = () => {
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const { data: licensedContent, isLoading } = useLicensedContentQuery(
    currentPageNumber,
    PAGE_SIZE,
  );
  const hasLicensedContent = licensedContent?.page?.length > 0;
  return (
    <>
      <Helmet title="My Content Area" />
      <Layout rowsSetup="grid-rows-content-view" responsiveLayout>
        <Navbar />
        <PageHeader title={hasLicensedContent ? 'My Content Area' : ''} />
        {hasLicensedContent || isLoading ? (
          <MyContentArea
            licensedContentPage={licensedContent}
            onPageChange={(newPage) => setCurrentPageNumber(newPage)}
          />
        ) : (
          <ContentEmptyPlaceholderState
            row="3"
            icon={<EmptyContentSVG />}
            title="No results found for My Content Area."
            description="You can track and review all licensed content once you have placed orders. "
          />
        )}
        <Footer />
      </Layout>
    </>
  );
};

export default ContentView;
