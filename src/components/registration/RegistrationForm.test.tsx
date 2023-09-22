import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import RegistrationForm from 'src/components/registration/RegistrationForm';

describe('Registration Form', () => {
  it('renders the form', async () => {
    const wrapper = render(<RegistrationForm onSubmit={jest.fn()} />);

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

    expect(
      wrapper.getByRole('button', { name: 'Create Account' }),
    ).toBeVisible();
  });

  it('Typed values are submitted when clicked Create Account button ', async () => {
    const onSubmit = jest.fn();
    const wrapper = render(<RegistrationForm onSubmit={onSubmit} />);

    fireEvent.change(wrapper.getByPlaceholderText('Your First name*'), {
      target: { value: 'LeBron' },
    });
    fireEvent.change(wrapper.getByPlaceholderText('Your Last name*'), {
      target: { value: 'James' },
    });
    fireEvent.change(wrapper.getByPlaceholderText('Your Professional Email*'), {
      target: { value: 'lj@nba.com' },
    });
    fireEvent.change(wrapper.getByPlaceholderText('Password*'), {
      target: { value: 'p@ss' },
    });
    fireEvent.change(wrapper.getByPlaceholderText('Confirm Password*'), {
      target: { value: 'p@ss' },
    });

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(onSubmit).toBeCalledWith({
      firstName: 'LeBron',
      lastName: 'James',
      email: 'lj@nba.com',
      password: 'p@ss',
      confirmPassword: 'p@ss',
    });
  });
});
