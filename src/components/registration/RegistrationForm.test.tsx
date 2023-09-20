import { render } from '@testing-library/react';
import React from 'react';
import RegistrationForm from 'src/components/registration/RegistrationForm';

describe('Registration Form', () => {
  it('renders the form', async () => {
    const wrapper = render(<RegistrationForm />);

    expect(wrapper.getByText('CourseSpark')).toBeVisible();
    expect(wrapper.getByText('Create new account')).toBeVisible();
    expect(wrapper.getByText('30 day trial')).toBeVisible();
    expect(wrapper.getByPlaceholderText('Your First name*')).toBeVisible();
    expect(wrapper.getByPlaceholderText('Your Last name*')).toBeVisible();
    expect(
      wrapper.getByPlaceholderText('Your Professional Email*'),
    ).toBeVisible();
    expect(wrapper.getByPlaceholderText('Password*')).toBeVisible();
    expect(wrapper.getByPlaceholderText('Confirm Password*')).toBeVisible();
    expect(
      wrapper.getByText(
        'By clicking Create Account, you agree to the Boclips User Agreement, Privacy Policy, and Cookie Policy.',
      ),
    ).toBeVisible();
    expect(wrapper.getByRole('button', { name: 'Create Account' }));
  });
});
