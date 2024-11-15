import RegistrationPageCheckbox from '@src/components/common/input/RegistrationPageCheckbox';
import React, { useState } from 'react';
import { Typography } from '@boclips-ui/typography';

interface Props {
  handleChange: (value: boolean) => void;
  isInvalid: boolean;
  isClassroomUser: boolean;
}

export const TermsAndConditionsCheckbox = ({
  handleChange,
  isInvalid,
  isClassroomUser,
}: Props) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const label = (
    <Typography.Body size="small" weight="medium">
      I understand that by checking this box, I am agreeing to the <br />
      <a
        rel="noopener noreferrer"
        href={
          isClassroomUser
            ? 'https://www.boclips.com/mlsa-classroom'
            : 'https://www.boclips.com/mlsa'
        }
        target="_blank"
      >
        <Typography.Link type="inline-blue">
          Boclips Terms &amp; Conditions
        </Typography.Link>
      </a>
    </Typography.Body>
  );

  const onClick = (value: boolean) => {
    setIsChecked(value);
    handleChange(value);
  };

  return (
    <RegistrationPageCheckbox
      onChange={(value) => onClick(value.target.checked)}
      errorMessage={
        isInvalid ? 'Boclips Terms and Conditions agreement is required' : null
      }
      name="boclips-terms-conditions-agreement"
      id="boclips-terms-conditions-agreement"
      checked={isChecked}
      dataQa="input-checkbox-boclips-terms-conditions"
      label={label}
    />
  );
};
