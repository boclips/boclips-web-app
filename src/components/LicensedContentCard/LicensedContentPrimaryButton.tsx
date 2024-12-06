import React, { ReactElement, useState } from 'react';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import s from '@src/components/LicensedContentCard/styles.module.less';
import { EmbedButton } from '@src/components/embedButton/EmbedButton';
import { Button } from 'boclips-ui';
import { useBoclipsClient } from '@src/components/common/providers/BoclipsClientProvider';
import { downloadFileFromUrl } from '@src/services/downloadFileFromUrl';
import { displayNotification } from '@src/components/common/notification/displayNotification';
import { LoadingOutlined } from '@ant-design/icons';
import { usePlatformInteractedWithEvent } from '@src/hooks/usePlatformInteractedWithEvent';
import DownloadIconSVG from '@resources/icons/download-icon.svg?react';

interface Props {
  licensedContent: LicensedContent;
}
const LicensedContentPrimaryButton = ({ licensedContent }: Props) => {
  const apiClient = useBoclipsClient();
  const { mutate: trackPlatformInteractedWithEvent } =
    usePlatformInteractedWithEvent();
  const embedAction = licensedContent.videoMetadata.links.createEmbedCode;
  const downloadAction = licensedContent.videoMetadata.links.download;
  const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false);
  const getButtonSpinner = (): ReactElement => (
    <span data-qa="spinner">
      <LoadingOutlined />
    </span>
  );

  if (!embedAction && !downloadAction) {
    return null;
  }

  return (
    <div className={s.primaryButton}>
      {embedAction && (
        <EmbedButton
          licensedContent={licensedContent}
          iconOnly={false}
          width="155px"
          height="48px"
          label="Embed Video"
          onClick={() =>
            trackPlatformInteractedWithEvent({
              subtype: 'MY_CONTENT_EMBED_BUTTON_CLICKED',
            })
          }
        />
      )}
      {downloadAction && (
        <Button
          width="155px"
          height="48px"
          text="MP4 Video"
          name="MP4 Video"
          disabled={isDownloadLoading}
          aria-label="download-mp4-video"
          icon={isDownloadLoading ? getButtonSpinner() : <DownloadIconSVG />}
          className={s.downloadButton}
          onClick={() => {
            setIsDownloadLoading(true);
            trackPlatformInteractedWithEvent({
              subtype: 'MY_CONTENT_DOWNLOAD_BUTTON_CLICKED',
            });
            apiClient.licenses
              .getDownloadVideoUrl(licensedContent)
              .then((url) => {
                downloadFileFromUrl(url);
              })
              .catch(() => {
                displayNotification(
                  'error',
                  `Download failed!`,
                  'Please try again later',
                  `download-video-failed-notification`,
                );
              })
              .finally(() => setIsDownloadLoading(false));
          }}
        />
      )}
    </div>
  );
};

export default LicensedContentPrimaryButton;
