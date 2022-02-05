import { render } from '@testing-library/react';
import React from 'react';
import { BoInputText } from 'src/components/common/input/BoInputText';

describe('boInput', () => {
  it('does not show error message when error is false', () => {
    const boinput = render(
      <BoInputText
        label="Input"
        error={false}
        errorMessage={"Shouldn't see me"}
        inputType="text"
      />,
    );

    expect(boinput.queryByText("Shouldn't see me")).toBeNull();
  });

  it('does shows error message when error is true', () => {
    const boinput = render(
      <BoInputText
        label="Input"
        error
        errorMessage="Should see me"
        inputType="text"
      />,
    );

    expect(boinput.queryByText('Should see me')).toBeVisible();
  });
});
