import React from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Typography } from '@boclips-ui/typography';
import s from './captions.module.less';

export const CaptionsModal = ({ setOpen }) => {
  return (
    <Bodal
      title="Download Captions"
      onCancel={() => setOpen(false)}
      closeOnClickOutside
      displayCancelButton={false}
      confirmButtonText="OK"
      onConfirm={() => setOpen(false)}
      dataQa="captions-modal"
      smallSize={false}
      footerClass={s.footer}
    >
      <Typography.Body as="section" className={s.message}>
        Human-generated captions are being processed. It will take up to 72
        hours once order has been placed.
      </Typography.Body>
    </Bodal>
  );
};
