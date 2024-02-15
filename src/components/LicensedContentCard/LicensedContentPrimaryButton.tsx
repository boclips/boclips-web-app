import React, { ReactElement, useState } from 'react';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import s from 'src/components/LicensedContentCard/styles.module.less';
import { EmbedButton } from 'src/components/embedButton/EmbedButton';
import Button from '@boclips-ui/button';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { downloadFileFromUrl } from 'src/services/downloadFileFromUrl';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { LoadingOutlined } from '@ant-design/icons';
import DownloadIconSVG from '../../resources/icons/download-icon.svg';

interface Props {
  licensedContent: LicensedContent;
}
const LicensedContentPrimaryButton = ({ licensedContent }: Props) => {
  const apiClient = useBoclipsClient();
  const embedAction = licensedContent.videoMetadata.links.createEmbedCode;
  const downloadAction = licensedContent.videoMetadata.links.download;
  const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false);
  const getButtonSpinner = (): ReactElement => (
    <span data-qa="spinner" className={s.spinner}>
      <LoadingOutlined />
    </span>
  );

  if (!embedAction && !downloadAction) {
    return null;
  }

  return (
    <>
      {embedAction && (
        <EmbedButton
          licensedContent={licensedContent}
          iconOnly={false}
          width="155px"
          height="48px"
          label="Embed Code"
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
            apiClient.licenses
              .getDownloadVideoUrl(licensedContent)
              .then((url) => {
                downloadFileFromUrl(url);
                setIsDownloadLoading(false);
              })
              .catch(() => {
                displayNotification(
                  'error',
                  `Download failed!`,
                  'Please try again later',
                  `download-video-failed-notification`,
                );
              });
          }}
        />
      )}
    </>
  );
};

export default LicensedContentPrimaryButton;
