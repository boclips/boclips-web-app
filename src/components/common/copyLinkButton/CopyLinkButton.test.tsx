import { fireEvent, render } from '@testing-library/react';
import { CopyLinkButton } from 'src/components/common/copyLinkButton/CopyLinkButton';
import React from 'react';

describe('copy link button', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it('triggers an alert upon copying link', async () => {
    const button = render(
      <CopyLinkButton link="https://url.com" ariaLabel="copy hello" />,
    );

    fireEvent.click(button.getByRole('button', { name: 'copy hello' }));

    expect(await button.findByRole('alert', { name: 'Copied' })).toBeVisible();
  });
});
