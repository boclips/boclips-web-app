import React from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Typography } from '@boclips-ui/typography';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import getFormattedDate from 'src/services/getFormattedDate';
import getFormattedDuration from 'src/services/getFormattedDuration';
import s from './styles.module.less';

interface Props {
  licensedContent: LicensedContent;
}

const LicensedContentCard = ({ licensedContent }: Props) => {
  const getLabeledField = (label: string, value: string) => (
    <Typography.Body as="div" size="small">
      <span className={s.label}>{label}:</span>
      <span className={s.value}>{value}</span>
    </Typography.Body>
  );

  return (
    <div className={s.cardWrapper}>
      <div className={s.videoWrapper}>
        <VideoPlayer videoLink={licensedContent.videoMetadata.links.self} />
      </div>
      <div className={s.licenseCardInfo}>
        <Typography.H4 className={s.title}>
          {licensedContent.videoMetadata.title}
        </Typography.H4>
        <div className="flex flex-row space-x-6">
          {getLabeledField(
            'Starting date',
            getFormattedDate(licensedContent.license.startDate),
          )}
          {getLabeledField(
            'Expiry date',
            getFormattedDate(licensedContent.license.endDate),
          )}
        </div>
        {getLabeledField('Order ID', licensedContent.license.orderId)}
        <div className={s.videoMetadataRow}>
          <Typography.Body as="div" size="small">
            {getFormattedDuration(licensedContent.videoMetadata.duration)}
          </Typography.Body>
          <Typography.Body as="div" size="small">
            {licensedContent.videoMetadata.channelName}
          </Typography.Body>
        </div>
      </div>
    </div>
  );
};

export default LicensedContentCard;
