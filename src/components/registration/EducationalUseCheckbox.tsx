import BoCheckbox from 'src/components/common/input/BoCheckbox';
import React from 'react';

interface Props {
  isError: boolean;
  checked: boolean;
  setChecked: (value: boolean) => void;
}

export const EducationalUseCheckbox = ({
  isError,
  checked,
  setChecked,
}: Props) => {
  return (
    <BoCheckbox
      label={
        'I certify that I am accessing this service solely for Educational Use. ' +
        '"Educational Use" is defined as to copy, communicate, edit, and/or ' +
        'incorporate into a publication or digital product for a learning outcome'
      }
      onChange={(value) => setChecked(value.target.checked)}
      errorMessage={isError ? 'Educational use agreement is mandatory' : null}
      name="educational-use-agreement"
      id="educational-use-agreement"
      checked={checked}
      dataQa="input-checkbox-educational-use-agreement"
    />
  );
};
