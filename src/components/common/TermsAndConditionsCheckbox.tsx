import RegistrationPageCheckbox from 'src/components/common/input/RegistrationPageCheckbox';
import React, { useState } from 'react';
import { Typography } from '@boclips-ui/typography';

interface Props {
  handleChange: (value: boolean) => void;
  isValid: boolean;
}

export const TermsAndConditionsCheckbox = ({
  handleChange,
  isValid,
}: Props) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const label = (
    <Typography.Body size="small" weight="medium">
      I understand that by checking this box, I am agreeing to the{' '}
      <a
        rel="noopener noreferrer"
        href="https://www.boclips.com/mlsa-2"
        target="_blank"
      >
        <Typography.Link type="inline-blue">
          Boclips Terms &amp; Conditions
        </Typography.Link>
      </a>
    </Typography.Body>
  );

  return (
    <RegistrationPageCheckbox
      onChange={(value) => {
        setIsChecked(value.target.checked);
        handleChange(isChecked);
      }}
      errorMessage={
        isValid ? 'Boclips Terms and Conditions agreement is required' : null
      }
      name="boclips-terms-conditions-agreement"
      id="boclips-terms-conditions-agreement"
      checked={isChecked}
      dataQa="input-checkbox-boclips-terms-conditions"
      label={label}
    />
  );
};
