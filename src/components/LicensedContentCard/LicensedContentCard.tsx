import React from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Typography } from '@boclips-ui/typography';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import getFormattedDate from 'src/services/getFormattedDate';
import getFormattedDuration from 'src/services/getFormattedDuration';
import c from 'classnames';
import { Link } from 'react-router-dom';
import LicensedContentPrimaryButton from 'src/components/LicensedContentCard/LicensedContentPrimaryButton';
import LicensedContentAssetsButton from 'src/components/LicensedContentCard/LicensedContentAssetsButton';
import LicensedContentTerritoryRestrictions from 'src/components/LicensedContentCard/LicensedContentTerritoryRestrictions';
import { usePlatformInteractedWithEvent } from 'src/hooks/usePlatformInteractedWithEvent';
import s from './styles.module.less';

interface Props {
  licensedContent: LicensedContent;
}

const LicensedContentCard = ({ licensedContent }: Props) => {
  const { mutate: trackPlatformInteraction } = usePlatformInteractedWithEvent();

  const getLabeledField = (label: string, value: string) => (
    <Typography.Body as="div" size="small">
      <span className={s.label}>{label}:</span>
      <span className={s.value}>{value}</span>
    </Typography.Body>
  );

  return (
    <div className={c(s.grid, s.cardWrapper)}>
      <div className={s.videoWrapper}>
        <VideoPlayer videoLink={licensedContent.videoMetadata.links.self} />
      </div>
      <div className={s.licenseCardInfo}>
        <div className={s.header}>
          <Link
            to={{
              pathname: `/videos/${licensedContent.videoId}`,
            }}
            onClick={() =>
              trackPlatformInteraction({
                subtype: 'MY_CONTENT_VIDEO_TITLE_CLICKED',
              })
            }
            state={{ userNavigated: true }}
            aria-label={`${licensedContent.videoMetadata.title} content card`}
          >
            <Typography.H4 className={s.title}>
              {licensedContent.videoMetadata.title}
            </Typography.H4>
          </Link>
        </div>
        <div className="flex flex-row space-x-6">
          {getLabeledField(
            'Starting date',
            getFormattedDate(licensedContent.license.startDate, {}),
          )}
          {getLabeledField(
            'Expiry date',
            getFormattedDate(licensedContent.license.endDate, {}),
          )}
        </div>
        <div>
          <Typography.Body as="div" size="small">
            <span className={s.label}>Order ID:</span>
            <Link
              to={{
                pathname: `/orders/${licensedContent.license.orderId}`,
              }}
              state={{ userNavigated: true }}
              onClick={() =>
                trackPlatformInteraction({
                  subtype: 'MY_CONTENT_AREA_ORDER_ID_CLICKED',
                })
              }
              aria-label={`${licensedContent.license.orderId} order link`}
            >
              <span className={s.link}>{licensedContent.license.orderId}</span>
            </Link>
          </Typography.Body>
        </div>
        <div>{getLabeledField('User ID', licensedContent.license.userId)}</div>
        <LicensedContentTerritoryRestrictions
          licensedContent={licensedContent}
        />
        <div className={s.videoMetadataRow}>
          <Typography.Body as="div" size="small">
            {getFormattedDuration(licensedContent.videoMetadata.duration)}
          </Typography.Body>
          <Typography.Body as="div" size="small">
            {licensedContent.videoMetadata.channelName}
          </Typography.Body>
        </div>
      </div>
      <div className={s.actionButtons}>
        <LicensedContentAssetsButton licensedContent={licensedContent} />
        <LicensedContentPrimaryButton licensedContent={licensedContent} />
      </div>
    </div>
  );
};

export default LicensedContentCard;
