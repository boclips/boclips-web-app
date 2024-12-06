import React from 'react';
import { act, render } from '@testing-library/react';
import SkipLink from '@components/skipLink/SkipLink';

describe('skip link', () => {
  it('adds class on focus', async () => {
    const wrapper = render(<SkipLink />);

    const focusEvent = new Event('focus');

    const buttonWrapper = wrapper.getByTestId('skip_to_content');
    act(() => {
      buttonWrapper.dispatchEvent(focusEvent);
    });

    expect(buttonWrapper.parentElement).toHaveClass('focused');
  });

  it('removes class on focusout', async () => {
    const wrapper = render(<SkipLink />);
    const buttonWrapper = wrapper.getByTestId('skip_to_content');

    const focusEvent = new Event('focus');

    act(() => {
      buttonWrapper.dispatchEvent(focusEvent);
    });

    expect(buttonWrapper.parentElement).toHaveClass('focused');

    const focusoutEvent = new Event('focusout');

    act(() => {
      wrapper.getByTestId('skip_to_content').dispatchEvent(focusoutEvent);
    });

    expect(buttonWrapper.parentElement).not.toHaveClass('focused');
  });
});
