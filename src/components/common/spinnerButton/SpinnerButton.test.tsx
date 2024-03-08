import React from 'react';
import { render } from '@testing-library/react';
import SpinnerButton from 'src/components/common/spinnerButton/SpinnerButton';

describe('Spinner Button', () => {
  it('renders button with text, no spinner', () => {
    const wrapper = render(
      <SpinnerButton height="44px" onClick={() => {}} text="Text on Button" />,
    );

    expect(
      wrapper.getByRole('button', { name: 'Text on Button' }),
    ).toBeVisible();

    expect(wrapper.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  it('renders spinner when requested', () => {
    const wrapper = render(
      <SpinnerButton
        height="44px"
        onClick={() => {}}
        text="Text on Button"
        spinning
      />,
    );

    expect(wrapper.getByText('Text on Button')).toBeVisible();
    expect(wrapper.getByTestId('spinner')).toBeVisible();
  });
});
