import React, { useEffect, useState } from 'react';
import { Layout } from '@src/components/layout/Layout';
import Navbar from '@src/components/layout/Navbar';
import PageHeader from '@src/components/pageTitle/PageHeader';
import { Hero as ContentEmptyPlaceholderState } from '@src/components/hero/Hero';
import EmptyContentSVG from '@src/resources/icons/empty-content.svg';
import InfoIcon from '@src/resources/icons/info.svg';
import Footer from '@src/components/layout/Footer';
import { Helmet } from 'react-helmet';
import { useLicensedContentQuery } from '@src/hooks/api/licensedContentQuery';
import LicensesArea from '@src/components/licensesArea/LicensesArea';
import { useLocationParams } from '@src/hooks/useLocationParams';
import { useNavigate } from 'react-router-dom';
import Tooltip, { Typography } from 'boclips-ui';
import { usePlatformInteractedWithEvent } from '@src/hooks/usePlatformInteractedWithEvent';
import getFormattedDate from '@src/services/getFormattedDate';
import { Warning } from '@src/components/common/warning/Warning';
import s from './style.module.less';

const PAGE_SIZE = 10;

const LicensesView = () => {
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
      <Helmet title="Licenses" />
      <Layout rowsSetup="grid-rows-content-view" responsiveLayout>
        <Navbar />
        <PageHeader
          className={s.contentHeader}
          title={hasLicensedContent ? 'My Licenses' : ''}
          button={
            hasLicensedContent && (
              <Tooltip
                isLarge
                text={
                  <div className="text-left w-96">
                    <p>
                      <b>My Licenses</b>
                    </p>
                    <br />
                    <p>
                      Access all your purchased content here once your order is
                      processed and licensed. Note that there may be a brief
                      delay between ordering and licensing; track your order
                      under Order History in the meantime.
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
          <div className="row-start-3 row-end-3 col-start-2 col-end-26">
            <Warning>
              <Typography.Body>
                Your Licenses from {licensesStartDate} are available here. For
                any order prior to {licensesStartDate} please reach out to{' '}
                <Typography.Link type="inline-blue">
                  <a href="mailto:support@boclips.com">support@boclips.com</a>
                </Typography.Link>
              </Typography.Body>
            </Warning>
          </div>
        )}
        {hasLicensedContent || isLoading ? (
          <LicensesArea
            licensedContentPage={licensedContent}
            onPageChange={(newPage) => setCurrentPageNumber(newPage)}
            isLoading={isLoading}
          />
        ) : (
          <ContentEmptyPlaceholderState
            icon={<EmptyContentSVG />}
            title="No results found for Licenses."
            description="You can track and review all licensed content once you have placed orders. "
          />
        )}
        <Footer />
      </Layout>
    </>
  );
};

export default LicensesView;
