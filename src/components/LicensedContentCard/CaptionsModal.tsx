import React, { useState } from 'react';
import { Bodal } from '@src/components/common/bodal/Bodal';
import { Typography } from 'boclips-ui';
import { Link } from 'boclips-api-client/dist/types';
import BoCheckbox from '@src/components/common/input/BoCheckbox';
import DownloadSVG from '@src/resources/icons/download-icon.svg';
import { fetchFile } from '@src/services/downloadFileFromUrl';
import s from './captions.module.less';

interface Props {
  setOpen: (open: boolean) => void;
  downloadLink?: Link;
}

export const CaptionsModal = ({ setOpen, downloadLink }: Props) => {
  const [isSRTSelected, setIsSRTSelected] = useState(false);
  const [isWEBVTTSelected, setIsWEBVTTSelected] = useState(false);
  const handleDownload = () => {
    if (isSRTSelected) {
      fetchFile(downloadLink.getTemplatedLink({ format: 'SRT' }));
    }
    if (isWEBVTTSelected) {
      fetchFile(downloadLink.getTemplatedLink({ format: 'VTT' }));
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
      onConfirm={() => handleDownload()}
      isConfirmEnabled={isSRTSelected || isWEBVTTSelected}
      dataQa="captions-modal"
      smallSize={false}
      confirmButtonIcon={<DownloadSVG />}
      footerClass={s.footer}
    >
      {downloadLink ? (
        <div className="flex flex-col h-14 justify-between">
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
