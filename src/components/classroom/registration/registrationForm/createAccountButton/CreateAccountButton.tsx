import s from '@components/classroom/registration/style.module.less';
import { Button } from 'boclips-ui';
import React, { ReactElement } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

interface Props {
  onClick: () => void;
  isLoading?: boolean;
}

const CreateAccountButton = ({ onClick, isLoading }: Props) => {
  const getButtonSpinner = (): ReactElement =>
    isLoading && (
      <span data-qa="spinner" className={s.spinner}>
        <LoadingOutlined />
      </span>
    );

  return (
    <section className={s.createAccountButtonWrapper}>
      <Button
        onClick={onClick}
        text="Create Account"
        disabled={isLoading}
        icon={getButtonSpinner()}
        className={s.createAccountButton}
        width="208px"
      />
    </section>
  );
};

export default CreateAccountButton;
