import { render } from '@testing-library/react';
import { VideoShareButton } from 'src/components/videoShareButton/VideoShareButton';
import React from 'react';

describe('video share button', () => {
  it(`renders label when iconOnly false`, async () => {
    const wrapper = render(<VideoShareButton />);
    expect(await wrapper.findByTestId('share-button')).toBeVisible();
    expect(await wrapper.findByText('Share')).toBeVisible();
  });

  it(`doesn't render label when iconOnly`, async () => {
    const wrapper = render(<VideoShareButton iconOnly />);
    expect(await wrapper.findByTestId('share-button')).toBeVisible();
    expect(wrapper.queryByText('Share')).toBeNull();
  });
});
