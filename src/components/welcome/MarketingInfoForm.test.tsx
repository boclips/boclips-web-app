import { render } from '@testing-library/react';
import React from 'react';
import MarketingInfoForm from 'src/components/welcome/MarketingInfoForm';

describe('Marketing Info Form', () => {
  it('renders the marketing info', async () => {
    const wrapper = render(<MarketingInfoForm />);

    expect(
      wrapper.getByText(
        'To complete the setup of your account, we require a few additional details (all fields marked * are mandatory).',
      ),
    ).toBeVisible();

    expect(wrapper.getByLabelText('Job Title*')).toBeVisible();
    expect(wrapper.getByPlaceholderText('example: Designer')).toBeVisible();

    expect(wrapper.getByText('Your audience type*')).toBeVisible();
    expect(wrapper.getByText('example: K12')).toBeVisible();

    expect(
      wrapper.getByLabelText('What Content are you interested in*'),
    ).toBeVisible();
    expect(wrapper.getByPlaceholderText('Design')).toBeVisible();

    expect(wrapper.getByText(/By clicking Create Account, you agree to the/));
    expect(
      wrapper.getByRole('link', { name: 'Boclips Terms & Conditions' }),
    ).toBeVisible();
    expect(wrapper.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();

    expect(
      wrapper.getByRole('button', { name: 'Create Account' }),
    ).toBeVisible();
  });
});
