import { Bodal } from 'src/components/common/bodal/Bodal';
import { Typography } from '@boclips-ui/typography';
import { InputText } from '@boclips-ui/input';
import Button from '@boclips-ui/button';
import React, { useState } from 'react';
import { handleEnterKeyEvent } from 'src/services/handleKeyEvent';
import s from './style.module.less';

interface Props {
  assetId: string;
  referer: string;
  fetchAssetWithCode: (params: {
    assetId: string;
    referer: string;
    shareCode: string;
  }) => void;
}

const ShareCodeModal = ({ assetId, referer, fetchAssetWithCode }: Props) => {
  const [shareCode, setShareCode] = useState('');

  const handleChange = (value: string) => {
    setShareCode(value);
  };

  const handleClick = () => {
    fetchAssetWithCode({ assetId, referer, shareCode });
  };

  const isButtonDisabled = shareCode.length !== 4;

  return (
    <Bodal
      title="Enter code to watch videos"
      showFooter={false}
      showCloseIcon={false}
      closeOnClickOutside={false}
      onCancel={() => {}}
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
          onKeyDown={(e) =>
            handleEnterKeyEvent(e, () =>
              isButtonDisabled ? {} : handleClick(),
            )
          }
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
