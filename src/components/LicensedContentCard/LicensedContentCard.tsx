import React from 'react';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import { Typography } from '@boclips-ui/typography';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import getFormattedDate from 'src/services/getFormattedDate';
import getFormattedDuration from 'src/services/getFormattedDuration';
import c from 'classnames';
import Button from '@boclips-ui/button';
import DownloadSVG from 'src/resources/icons/download.svg';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import s from './styles.module.less';

interface Props {
  licensedContent: LicensedContent;
}

const LicensedContentCard = ({ licensedContent }: Props) => {
  const client = useBoclipsClient();
  const getLabeledField = (label: string, value: string) => (
    <Typography.Body as="div" size="small">
      <span className={s.label}>{label}:</span>
      <span className={s.value}>{value}</span>
    </Typography.Body>
  );

  const downloadTranscript = async () => {
    await client.videos
      .getTranscript({ title })
      .then((response) => {
        const href = URL.createObjectURL(new Blob([response.content]));

        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', response.filename);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch(() => {
        displayNotification('error', `Download failed!`, '', ``);
      });
  };

  return (
    <div className={c(s.grid, s.cardWrapper)}>
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
      <div className={s.videoAssetsButtonWrapper}>
        {/* todo: move to separate component? */}
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger className={s.videoAssetsButton} asChild>
            <Button onClick={() => null} text="Video Assets" type="outline" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={s.videoAssetsDropdownWrapper}
              align="end"
            >
              <DropdownMenu.Group>
                <DropdownMenu.Item
                  className={s.assetDropdownItem}
                  textValue="Transcript"
                  onSelect={downloadTranscript}
                >
                  <DownloadSVG />
                  <Typography.Body as="span" weight="medium">
                    Transcript
                  </Typography.Body>
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

export default LicensedContentCard;
