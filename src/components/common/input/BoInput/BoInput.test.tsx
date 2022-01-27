import { render } from '@testing-library/react';
import React from 'react';
import { BoInput } from 'src/components/common/input/BoInput/BoInput';

describe('boInput', () => {
  it('does not show error message when error is false', () => {
    const boinput = render(
      <BoInput label="Input" error={false} errorMessage={"Shouldn't see me"} />,
    );

    expect(boinput.queryByText("Shouldn't see me")).toBeNull();
  });

  it('does shows error message when error is true', () => {
    const boinput = render(
      <BoInput label="Input" error errorMessage="Should see me" />,
    );

    expect(boinput.queryByText('Should see me')).toBeVisible();
  });
});
