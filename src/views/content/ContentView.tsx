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
import Tooltip from '@boclips-ui/tooltip';
import { usePlatformInteractedWithEvent } from 'src/hooks/usePlatformInteractedWithEvent';
import { Typography } from '@boclips-ui/typography';
import getFormattedDate from 'src/services/getFormattedDate';
import s from './style.module.less';

const PAGE_SIZE = 10;

const ContentView = () => {
  const locationParams = useLocationParams();
  const { mutate: trackPlatformInteraction } = usePlatformInteractedWithEvent();
  const navigator = useNavigate();

  const licensesStartDate = getFormattedDate(new Date('2023-03-31'), {
    monthFormat: 'long',
  });
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(
    locationParams.get('page') ? Number(locationParams.get('page')) : 0,
  );
  const { data: licensedContent, isLoading } = useLicensedContentQuery(
    currentPageNumber,
    PAGE_SIZE,
  );

  const handleTooltipHover = () => {
    trackPlatformInteraction({ subtype: 'MY_CONTENT_AREA_INFO_VIEWED' });
  };

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
            hasLicensedContent && (
              <Tooltip
                isLarge
                text={
                  <div className="text-left w-96">
                    <p>
                      <b>My Content Area</b>
                    </p>
                    <br />
                    <p>
                      Access all your purchased content here once your order is
                      processed and licensed. Note that there may be a brief
                      delay between ordering and licensing; track your order
                      under My Orders in the meantime.
                      <br />
                      Download content files, metadata, transcripts, and
                      captions here, if available in your account. For
                      inquiries, contact{' '}
                      <a href="mailTo:support@boclips.com">
                        support@boclips.com
                      </a>
                      .
                    </p>
                  </div>
                }
              >
                <div
                  data-qa="content-info"
                  className={s.infoIcon}
                  onMouseOver={handleTooltipHover}
                  onFocus={handleTooltipHover}
                >
                  <InfoIcon onClick={null} />
                </div>
              </Tooltip>
            )
          }
        />
        {hasLicensedContent && (
          <Typography.Body
            as="div"
            weight="medium"
            className="row-start-3 row-end-3 col-start-2 col-end-24"
          >
            Your Licenses from {licensesStartDate} are available here. For any
            order prior to {licensesStartDate} please reach out to{' '}
            <Typography.Link type="inline-blue">
              <a href="mailto:support@boclips.com">support@boclips.com</a>
            </Typography.Link>
          </Typography.Body>
        )}
        {hasLicensedContent || isLoading ? (
          <MyContentArea
            licensedContentPage={licensedContent}
            onPageChange={(newPage) => setCurrentPageNumber(newPage)}
            isLoading={isLoading}
          />
        ) : (
          <ContentEmptyPlaceholderState
            row="4"
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
