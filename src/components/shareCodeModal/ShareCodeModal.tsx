import { Bodal } from 'src/components/common/bodal/Bodal';
import { Typography } from '@boclips-ui/typography';
import { InputText } from '@boclips-ui/input';
import Button from '@boclips-ui/button';
import React, { useState } from 'react';
import s from './style.module.less';

interface Props {
  videoId: string;
  referer: string;
  fetchVideoWithCode: (params: {
    videoId: string;
    referer: string;
    shareCode: string;
  }) => void;
}

const ShareCodeModal = ({ videoId, referer, fetchVideoWithCode }: Props) => {
  const [shareCode, setShareCode] = useState('');

  const handleChange = (value: string) => {
    setShareCode(value);
  };

  const handleClick = () => {
    fetchVideoWithCode({ videoId, referer, shareCode });
  };

  const isButtonDisabled = shareCode.length !== 4;

  return (
    <Bodal
      title="Enter code to watch videos"
      showFooter={false}
      showCloseIcon={false}
    >
      <Typography.Body>
        Don&apos;t have a code? Ask your teacher.
      </Typography.Body>
      <section className={s.inputShareCodeRow}>
        <InputText
          id="share-code-input"
          onChange={handleChange}
          inputType="text"
          placeholder="Teacher code"
          height="44px"
          width="170px"
          defaultValue={shareCode}
          constraints={{ maxLength: 4 }}
        />
        <Button
          height="44px"
          onClick={handleClick}
          text="Watch Video"
          disabled={isButtonDisabled}
        />
      </section>
    </Bodal>
  );
};

export default ShareCodeModal;
