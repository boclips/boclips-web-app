import Button from 'boclips-ui';
import React, { ReactElement } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

interface Props {
  height: string;
  onClick: () => void;
  text: string;
  disabled?: boolean;
  spinning?: boolean;
}

const SpinnerButton = ({
  height,
  onClick,
  text,
  disabled = false,
  spinning = false,
}: Props) => {
  const getSpinner = (): ReactElement =>
    spinning ? (
      <span data-qa="spinner" className="pb-2">
        <LoadingOutlined />
      </span>
    ) : null;

  return (
    <Button
      height={height}
      onClick={onClick}
      text={text}
      disabled={spinning || disabled}
      icon={getSpinner()}
    />
  );
};

export default SpinnerButton;
