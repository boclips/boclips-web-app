import React from 'react';
import { render } from '@testing-library/react';
import BoCheckbox from '@components/common/input/BoCheckbox';

describe('BoCheckbox', () => {
  it('renders label over name', () => {
    const wrapper = render(
      <BoCheckbox
        id="123"
        onChange={() => {}}
        label="superLabel"
        name="superName"
        checked={false}
      />,
    );
    expect(wrapper.getByText('superLabel')).toBeVisible();
  });

  it('renders name if label not specified', () => {
    const wrapper = render(
      <BoCheckbox
        id="123"
        onChange={() => {}}
        name="superName"
        checked={false}
      />,
    );
    expect(wrapper.getByText('superName')).toBeVisible();
  });

  it('renders error message', () => {
    const wrapper = render(
      <BoCheckbox
        id="123"
        onChange={() => {}}
        name="superName"
        errorMessage="superError"
        checked={false}
      />,
    );
    expect(wrapper.getByText('superError')).toBeVisible();
  });
});
