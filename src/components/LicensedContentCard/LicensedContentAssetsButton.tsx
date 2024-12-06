import React from 'react';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import s from '@components/LicensedContentCard/styles.module.less';
import { Button, Typography } from 'boclips-ui';
import { useBoclipsClient } from '@components/common/providers/BoclipsClientProvider';
import { downloadFileFromUrl } from '@src/services/downloadFileFromUrl';
import { displayNotification } from '@components/common/notification/displayNotification';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import DownloadSVG from '@resources/icons/download.svg?react';
import OptionsDotsSVG from '@resources/icons/options-dots.svg?react';
import { CaptionsModal } from '@components/LicensedContentCard/CaptionsModal';
import { usePlatformInteractedWithEvent } from '@src/hooks/usePlatformInteractedWithEvent';

interface Props {
  licensedContent: LicensedContent;
}
const LicensedContentPrimaryButton = ({ licensedContent }: Props) => {
  const client = useBoclipsClient();
  const [openCaptionsModal, setOpenCaptionsModal] = React.useState(false);
  const { mutate: platformInteractedWithEvent } =
    usePlatformInteractedWithEvent();
  const downloadTranscript = async () => {
    platformInteractedWithEvent({
      subtype: 'MY_CONTENT_TRANSCRIPT_BUTTON_CLICKED',
    });
    await client.licenses
      .getTranscript(licensedContent)
      .then((response) => {
        const href = URL.createObjectURL(new Blob([response.content]));
        downloadFileFromUrl(href, response.filename);
        URL.revokeObjectURL(href);
      })
      .catch(() => {
        displayNotification('error', `Download failed!`, '', ``);
      });
  };

  const downloadMetadata = async () => {
    platformInteractedWithEvent({
      subtype: 'MY_CONTENT_METADATA_BUTTON_CLICKED',
    });
    await client.licenses
      .getMetadata(licensedContent)
      .then((response) => {
        const href = URL.createObjectURL(new Blob([response.content]));
        downloadFileFromUrl(href, response.filename);
        console.log(response);
        URL.revokeObjectURL(href);
      })
      .catch(() => {
        displayNotification('error', `Download metadata failed!`, '', ``);
      });
  };

  return (
    <>
      <div className={s.assetsButton}>
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger className={s.assetsDropdown} asChild>
            <Button
              onClick={() =>
                platformInteractedWithEvent({
                  subtype: 'MY_CONTENT_VIDEO_ASSETS_CLICKED',
                  anonymous: false,
                })
              }
              text="Video Assets"
              type="outline"
            />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={s.assetsDropdownItemsWrapper}
              align="end"
            >
              <DropdownMenu.Group>
                {licensedContent.videoMetadata.links.downloadMetadata && (
                  <DropdownMenu.Item
                    className={s.assetDropdownItem}
                    textValue="Metadata"
                    onSelect={downloadMetadata}
                  >
                    <DownloadSVG />
                    <Typography.Body as="span" weight="medium">
                      Metadata
                    </Typography.Body>
                  </DropdownMenu.Item>
                )}
                {licensedContent.videoMetadata.links.transcript && (
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
                )}
                {licensedContent.videoMetadata.links.downloadCaptions && (
                  <DropdownMenu.Item
                    className={s.assetDropdownItem}
                    textValue="Captions"
                    onSelect={() => {
                      platformInteractedWithEvent({
                        subtype: 'MY_CONTENT_CAPTIONS_BUTTON_CLICKED',
                      });
                      setOpenCaptionsModal(true);
                    }}
                  >
                    <OptionsDotsSVG />
                    <Typography.Body as="span" weight="medium">
                      Captions
                    </Typography.Body>
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      {openCaptionsModal && (
        <CaptionsModal
          setOpen={setOpenCaptionsModal}
          downloadLink={licensedContent.videoMetadata.links.downloadCaptions}
        />
      )}
    </>
  );
};

export default LicensedContentPrimaryButton;
