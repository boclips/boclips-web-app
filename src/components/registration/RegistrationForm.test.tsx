import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import RegistrationForm from 'src/components/registration/RegistrationForm';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { ToastContainer } from 'react-toastify';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';

describe('Registration Form', () => {
  it('renders the form', async () => {
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <RegistrationForm />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

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
    const fakeClient = new FakeBoclipsClient();
    const createTrialUserSpy = jest.spyOn(fakeClient.users, 'createTrialUser');

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <RegistrationForm />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    fillRegistrationForm(
      wrapper,
      'LeBron',
      'James',
      'lj@nba.com',
      'p@ss',
      'p@ss',
    );

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(createTrialUserSpy).toBeCalledWith({
        firstName: 'LeBron',
        lastName: 'James',
        email: 'lj@nba.com',
        password: 'p@ss',
        type: UserType.trialB2bUser,
      });
    });
  });

  it('error notification is displayed when trial user creation fails, inputs are not cleared', async () => {
    const fakeClient = new FakeBoclipsClient();
    jest
      .spyOn(fakeClient.users, 'createTrialUser')
      .mockImplementation(() => Promise.reject());

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <ToastContainer />
          <RegistrationForm />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    fillRegistrationForm(
      wrapper,
      'LeBron',
      'James',
      'lj@nba.com',
      'p@ss',
      'p@ss',
    );

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(await wrapper.findByText('User creation failed')).toBeVisible();

    expect(wrapper.getByDisplayValue('LeBron')).toBeVisible();
    expect(wrapper.getByDisplayValue('James')).toBeVisible();
    expect(wrapper.getByDisplayValue('lj@nba.com')).toBeVisible();
    expect(wrapper.getAllByDisplayValue('p@ss')).toHaveLength(2);
  });

  it('success notification is displayed when trial user creation passes, inputs are cleared', async () => {
    const fakeClient = new FakeBoclipsClient();
    jest
      .spyOn(fakeClient.users, 'createTrialUser')
      .mockImplementation(() =>
        Promise.resolve(UserFactory.sample({ email: 'test@boclips.com' })),
      );

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <ToastContainer />
          <RegistrationForm />
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    fillRegistrationForm(
      wrapper,
      'LeBron',
      'James',
      'lj@nba.com',
      'p@ss',
      'p@ss',
    );

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(
      await wrapper.findByText('User test@boclips.com successfully created'),
    ).toBeVisible();

    expect(wrapper.queryByDisplayValue('LeBron')).toBeNull();
    expect(wrapper.queryByDisplayValue('James')).toBeNull();
    expect(wrapper.queryByDisplayValue('lj@nba.com')).toBeNull();
    expect(wrapper.queryAllByDisplayValue('p@ss')).toHaveLength(0);
  });

  function fillRegistrationForm(
    wrapper: RenderResult,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) {
    fireEvent.change(wrapper.getByPlaceholderText('Your First name*'), {
      target: { value: firstName },
    });
    fireEvent.change(wrapper.getByPlaceholderText('Your Last name*'), {
      target: { value: lastName },
    });
    fireEvent.change(wrapper.getByPlaceholderText('Your Professional Email*'), {
      target: { value: email },
    });
    fireEvent.change(wrapper.getByPlaceholderText('Password*'), {
      target: { value: password },
    });
    fireEvent.change(wrapper.getByPlaceholderText('Confirm Password*'), {
      target: { value: confirmPassword },
    });
  }
});
