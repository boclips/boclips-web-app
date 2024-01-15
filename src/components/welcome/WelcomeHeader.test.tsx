import { render } from '@testing-library/react';
import React from 'react';
import WelcomeHeader from 'src/components/welcome/WelcomeHeader';

describe('welcome header', () => {
  it('Form title is provided for regular user', async () => {
    const wrapper = render(<WelcomeHeader isAdmin={false} />);

    expect(
      await wrapper.findByText(
        'Your colleague has invited you to a Boclips Library preview!',
      ),
    ).toBeVisible();
  });

  it('Form title is provided for admin user', async () => {
    const wrapper = render(<WelcomeHeader isAdmin />);

    expect(
      await wrapper.findByText('Tell us a bit more about you'),
    ).toBeVisible();
  });
});
