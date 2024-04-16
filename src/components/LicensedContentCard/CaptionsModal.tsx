import React, { useState } from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Typography } from '@boclips-ui/typography';
import { Link } from 'boclips-api-client/dist/types';
import BoCheckbox from 'src/components/common/input/BoCheckbox';
import { downloadFileFromUrl } from 'src/services/downloadFileFromUrl';
import s from './captions.module.less';

interface Props {
  setOpen: (open: boolean) => void;
  downloadLink?: Link;
}

export const CaptionsModal = ({ setOpen, downloadLink }: Props) => {
  const [isSRTSelected, setIsSRTSelected] = useState(false);
  const [isWEBVTTSelected, setIsWEBVTTSelected] = useState(false);
  const handledownload = () => {
    if (isSRTSelected) {
      downloadFileFromUrl(
        downloadLink.getTemplatedLink({ format: 'srt' }),
        'srtDownload',
      );
    }
    if (isWEBVTTSelected) {
      downloadFileFromUrl(
        downloadLink.getTemplatedLink({ format: 'webvtt' }),
        'webvtt',
      );
    }
    setOpen(false);
  };

  return (
    <Bodal
      title="Download Captions"
      onCancel={() => setOpen(false)}
      closeOnClickOutside
      displayCancelButton={false}
      confirmButtonText={downloadLink ? 'Download' : 'OK'}
      onConfirm={() => handledownload()}
      isConfirmEnabled={isSRTSelected || isWEBVTTSelected}
      dataQa="captions-modal"
      smallSize={false}
      footerClass={s.footer}
    >
      {downloadLink ? (
        <div>
          <BoCheckbox
            name="English WEBVTT"
            onChange={(e) => setIsWEBVTTSelected(e.target.checked)}
            checked={isWEBVTTSelected}
            id="webvtt-captions"
          />
          <BoCheckbox
            name="English SRT"
            onChange={(e) => setIsSRTSelected(e.target.checked)}
            id="srt-captions"
            checked={isSRTSelected}
          />
        </div>
      ) : (
        <Typography.Body as="section" className={s.message}>
          Human-generated captions are being processed. It will take up to 72
          hours once order has been placed.
        </Typography.Body>
      )}
    </Bodal>
  );
};
