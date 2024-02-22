import React, { useEffect, useState } from 'react';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import PageHeader from 'src/components/pageTitle/PageHeader';
import { Hero as ContentEmptyPlaceholderState } from 'src/components/hero/Hero';
import EmptyContentSVG from 'src/resources/icons/empty-content.svg';
import InfoIcon from 'src/resources/icons/info.svg';
import Footer from 'src/components/layout/Footer';
import { Helmet } from 'react-helmet';
import { useLicensedContentQuery } from 'src/hooks/api/licensedContentQuery';
import MyContentArea from 'src/components/MyContentArea/MyContentArea';
import { useLocationParams } from 'src/hooks/useLocationParams';
import { useNavigate } from 'react-router-dom';
import TooltipLocal from 'src/views/content/TooltipLocal';
import s from './style.module.less';

const PAGE_SIZE = 10;

const ContentView = () => {
  const locationParams = useLocationParams();
  const navigator = useNavigate();

  const [currentPageNumber, setCurrentPageNumber] = useState<number>(
    locationParams.get('page') ? Number(locationParams.get('page')) : 0,
  );
  const { data: licensedContent, isLoading } = useLicensedContentQuery(
    currentPageNumber,
    PAGE_SIZE,
  );

  useEffect(() => {
    locationParams.set('page', currentPageNumber.toString());
    navigator({
      search: locationParams.toString(),
    });
  }, [currentPageNumber]);

  const hasLicensedContent = licensedContent?.page?.length > 0;
  return (
    <>
      <Helmet title="My Content Area" />
      <Layout rowsSetup="grid-rows-content-view" responsiveLayout>
        <Navbar />
        <PageHeader
          className={s.contentHeader}
          title={hasLicensedContent ? 'My Content Area' : ''}
          button={
            <Tooltip
              isLarge
              text={
                <div>
                  <h1> My Content Area</h1>
                  <p>
                    Find all your purchased content in one place. Content will
                    be shown here when your order has been received and your
                    content is licensed according to your requirements. There
                    could be a small time delay between order and licensing but
                    you will be able to see your order in My Orders in the
                    meantime.
                  </p>
                  <p>
                    Access and takeaway the content files and also supplementary
                    video assets such as metadata, transcripts and captions. On
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    this page, you'll find all the essential information about
                    the
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    content you've purchased.
                  </p>
                  <p>
                    You can download the metadata, transcript, and captions if
                    you have a download account. If you have any questions about
                    video assets contact us at
                    <a href="mailTo:support@boclips.com">
                      {' '}
                      support@boclips.com
                    </a>
                    .
                  </p>
                </div>
              }
            >
              <button
                type="button"
                data-qa="territories-details"
                className={s.infoIcon}
              >
                <InfoIcon onClick={null} />
              </button>
            </Tooltip>
          }
        />
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
