import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import PageHeader from 'src/components/pageTitle/PageHeader';
import InfoIcon from 'src/resources/icons/info.svg';
import Footer from 'src/components/layout/Footer';
import { Helmet } from 'react-helmet';
import { useUserLicensedContentQuery } from 'src/hooks/api/licensedContentQuery';
import Tooltip from '@boclips-ui/tooltip';
import { usePlatformInteractedWithEvent } from 'src/hooks/usePlatformInteractedWithEvent';
import { Typography } from '@boclips-ui/typography';
import getFormattedDate from 'src/services/getFormattedDate';
import { Warning } from 'src/components/common/warning/Warning';
import { List, Root, Trigger } from '@radix-ui/react-tabs';
import { LicensesTab } from 'src/components/licensesArea/LicensesTab';
import s from './style.module.less';

const LicensesView = () => {
  const { mutate: trackPlatformInteraction } = usePlatformInteractedWithEvent();

  const licensesStartDate = getFormattedDate(new Date('2023-03-31'), {
    monthFormat: 'long',
  });

  const handleTooltipHover = () => {
    trackPlatformInteraction({ subtype: 'MY_CONTENT_AREA_INFO_VIEWED' });
  };

  return (
    <>
      <Helmet title="Licenses" />
      <Layout rowsSetup="grid-rows-content-view" responsiveLayout>
        <Navbar />
        <PageHeader
          className={s.contentHeader}
          title="My Licenses"
          button={
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
                    processed and licensed. Note that there may be a brief delay
                    between ordering and licensing; track your order under Order
                    History in the meantime.
                    <br />
                    Download content files, metadata, transcripts, and captions
                    here, if available in your account. For inquiries, contact{' '}
                    <a href="mailTo:support@boclips.com">support@boclips.com</a>
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
          }
        />
        <div className={s.licensesWrapper}>
          <Warning>
            <Typography.Body>
              Your Licenses from {licensesStartDate} are available here. For any
              order prior to {licensesStartDate} please reach out to{' '}
              <Typography.Link type="inline-blue">
                <a href="mailto:support@boclips.com">support@boclips.com</a>
              </Typography.Link>
            </Typography.Body>
          </Warning>
          <Root
            defaultValue="my-licenses"
            orientation="horizontal"
            className={s.licensesTab}
          >
            <List aria-label="tabs licenses" className={s.tabNavBar}>
              <Trigger
                value="my-licenses"
                className={s.tabHeader}
                onMouseDown={() =>
                  trackPlatformInteraction({ subtype: 'MY_LICENSES_VIEWED' })
                }
              >
                <Typography.H5>My licenses</Typography.H5>
              </Trigger>
            </List>
            <LicensesTab
              value="my-licenses"
              getLicenses={useUserLicensedContentQuery}
            />
          </Root>
        </div>
        <Footer />
      </Layout>
    </>
  );
};

export default LicensesView;
