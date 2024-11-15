import React from 'react';
import { render } from '@testing-library/react';
import Bubble from '@src/components/playlists/comments/Bubble';

describe('Bubble', () => {
  it('contains an aria-label attribute', () => {
    const wrapper = render(<Bubble inline number={1} ariaLabel="myBubble" />);

    expect(wrapper.getByLabelText('myBubble')).toBeVisible();
  });
});
