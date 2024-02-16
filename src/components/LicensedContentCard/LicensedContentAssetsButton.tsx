import React from 'react';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import s from 'src/components/LicensedContentCard/styles.module.less';
import Button from '@boclips-ui/button';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { downloadFileFromUrl } from 'src/services/downloadFileFromUrl';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import DownloadSVG from 'src/resources/icons/download.svg';
import { Typography } from '@boclips-ui/typography';

interface Props {
  licensedContent: LicensedContent;
}
const LicensedContentPrimaryButton = ({ licensedContent }: Props) => {
  const client = useBoclipsClient();

  const downloadTranscript = async () => {
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

  return (
    <div className={s.assetsButton}>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger className={s.assetsDropdown} asChild>
          <Button onClick={() => null} text="Video Assets" type="outline" />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={s.assetsDropdownItemsWrapper}
            align="end"
          >
            <DropdownMenu.Group>
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
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default LicensedContentPrimaryButton;
