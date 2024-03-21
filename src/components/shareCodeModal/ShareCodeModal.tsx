import { Bodal } from 'src/components/common/bodal/Bodal';
import { Typography } from '@boclips-ui/typography';
import { InputText } from '@boclips-ui/input';
import React, { useState } from 'react';
import { handleEnterKeyEvent } from 'src/services/handleKeyEvent';
import SpinnerButton from 'src/components/common/spinnerButton/SpinnerButton';
import s from './style.module.less';

interface Props {
  assetId: string;
  referer: string;
  fetchAssetWithCode: (params: {
    assetId: string;
    referer: string;
    shareCode: string;
  }) => void;
  isFetching: boolean;
  isError: boolean;
}

const ShareCodeModal = ({
  assetId,
  referer,
  fetchAssetWithCode,
  isFetching = false,
  isError = false,
}: Props) => {
  const [shareCode, setShareCode] = useState('');
  const [hideError, setHideError] = useState(false);

  const handleChange = (value: string) => {
    setShareCode(value);
  };

  const handleFocus = () => {
    setHideError(true);
  };

  const handleClick = () => {
    setHideError(false);
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
          onFocus={handleFocus}
          inputType="text"
          placeholder="Unique access code"
          height="44px"
          width="180px"
          defaultValue={shareCode}
          constraints={{ maxLength: 4 }}
          onKeyDown={(e) =>
            handleEnterKeyEvent(e, () =>
              isButtonDisabled ? {} : handleClick(),
            )
          }
          isError={!hideError && isError}
          errorMessage="Invalid code"
          errorMessagePlacement="bottom"
        />
        <SpinnerButton
          height="44px"
          onClick={handleClick}
          text="Watch Video"
          disabled={isButtonDisabled}
          spinning={isFetching}
        />
      </section>
    </Bodal>
  );
};

export default ShareCodeModal;
