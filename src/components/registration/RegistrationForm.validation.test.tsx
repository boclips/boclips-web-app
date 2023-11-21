import './mockRecaptcha';
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import RegistrationForm, {
  RegistrationData,
} from 'src/components/registration/RegistrationForm';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { fillRegistrationForm } from 'src/components/registration/registrationFormTestHelpers';

describe('Registration Form Validation', () => {
  const fakeClient = new FakeBoclipsClient();
  const createTrialUserSpy = jest.spyOn(fakeClient.users, 'createTrialUser');

  it('first name cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { firstName: '' });

    await checkErrorIsNotVisible(wrapper, 'First name is required');
    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));
    await checkErrorIsVisible(wrapper, 'First name is required');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('last name cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { lastName: '' });

    await checkErrorIsNotVisible(wrapper, 'Last name is required');
    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));
    await checkErrorIsVisible(wrapper, 'Last name is required');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('email cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { email: '' });

    await checkErrorIsNotVisible(wrapper, 'Email is required');
    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));
    await checkErrorIsVisible(wrapper, 'Email is required');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('email must have correct format', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { email: 'wrong@' });

    await checkErrorIsNotVisible(wrapper, 'Please enter a valid email address');
    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));
    await checkErrorIsVisible(wrapper, 'Please enter a valid email address');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('account name cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { accountName: '' });

    await checkErrorIsNotVisible(wrapper, 'Account name is required');
    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));
    await checkErrorIsVisible(wrapper, 'Account name is required');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('password cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { password: '' });

    await checkErrorIsNotVisible(wrapper, 'Password is required');
    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));
    await checkErrorIsVisible(wrapper, 'Password is required');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('password must be strong', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { password: 'pass' });

    const errorMessage =
      'Password must be at least 8 characters long and contain a combination of letters, numbers, and special characters';

    await checkErrorIsNotVisible(wrapper, errorMessage);
    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));
    await checkErrorIsVisible(wrapper, errorMessage);

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('passwords must match ', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, {
      password: 'abc@5678',
      confirmPassword: 'def',
    });

    await checkErrorIsNotVisible(wrapper, 'Passwords do not match');
    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));
    await checkErrorIsVisible(wrapper, 'Passwords do not match');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('job title cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { jobTitle: '' });

    await checkErrorIsNotVisible(wrapper, 'Please select a job title');
    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));
    await checkErrorIsVisible(wrapper, 'Please select a job title');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('country cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { country: '' });

    await checkErrorIsNotVisible(wrapper, 'Please select a country');
    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));
    await checkErrorIsVisible(wrapper, 'Please select a country');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('type of organisation cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { typeOfOrg: '' });

    await checkErrorIsNotVisible(
      wrapper,
      'Please select a type of organisation',
    );
    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));
    await checkErrorIsVisible(wrapper, 'Please select a type of organisation');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('audience cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { audience: '' });

    await checkErrorIsNotVisible(wrapper, 'Please select an audience');
    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));
    await checkErrorIsVisible(wrapper, 'Please select an audience');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('prompts user to check educational use checkbox if not checked and user clicks submit', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { hasAcceptedEducationalUseTerms: false });

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(
      await wrapper.findByText('Educational use agreement is mandatory'),
    ).toBeVisible();

    expect(createTrialUserSpy).not.toBeCalled();
  });

  it('displays error message if email already exists', async () => {
    jest
      .spyOn(fakeClient.users, 'createTrialUser')
      .mockImplementation(() =>
        Promise.reject(new Error('User already exists for account: Boclips')),
      );

    const wrapper = renderRegistrationForm();
    fillTheForm(wrapper, { email: 'existing@email.com' });

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(await wrapper.findByText('Email already exists')).toBeVisible();
  });

  it('displays error message if account name already exists', async () => {
    jest
      .spyOn(fakeClient.users, 'createTrialUser')
      .mockImplementation(() =>
        Promise.reject(new Error('Account Boclips already exists')),
      );

    const wrapper = renderRegistrationForm();
    fillTheForm(wrapper, { accountName: 'Boclips' });

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(
      await wrapper.findByText('Account name already exists'),
    ).toBeVisible();
  });

  it('errors disappear when form is fixed', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      accountName: '',
      country: '',
      jobTitle: '',
      typeOfOrg: '',
      desiredContent: '',
      discoveryMethod: '',
      email: '',
      audience: '',
      hasAcceptedEducationalUseTerms: false,
    });

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    await checkErrorIsVisible(wrapper, 'First name is required');
    await checkErrorIsVisible(wrapper, 'Last name is required');
    await checkErrorIsVisible(wrapper, 'Email is required');
    await checkErrorIsVisible(wrapper, 'Account name is required');
    await checkErrorIsVisible(wrapper, 'Password is required');
    await checkErrorIsVisible(wrapper, 'Please select a job title');
    await checkErrorIsVisible(wrapper, 'Please select a country');
    await checkErrorIsVisible(wrapper, 'Please select a type of organisation');
    await checkErrorIsVisible(wrapper, 'Please select an audience');
    await checkErrorIsVisible(
      wrapper,
      'Educational use agreement is mandatory',
    );

    fillTheForm(wrapper, {});
    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    await checkErrorIsNotVisible(wrapper, 'First name is required');
    await checkErrorIsNotVisible(wrapper, 'Last name is required');
    await checkErrorIsNotVisible(wrapper, 'Email is required');
    await checkErrorIsNotVisible(wrapper, 'Account name is required');
    await checkErrorIsNotVisible(wrapper, 'Password is required');
    await checkErrorIsNotVisible(wrapper, 'Please select a job title');
    await checkErrorIsNotVisible(wrapper, 'Please select a country');
    await checkErrorIsNotVisible(
      wrapper,
      'Please select a type of organisation',
    );
    await checkErrorIsNotVisible(wrapper, 'Please select an audience');
    await checkErrorIsNotVisible(
      wrapper,
      'Educational use agreement is mandatory',
    );

    await waitFor(() => {
      expect(createTrialUserSpy).toBeCalled();
    });
  });

  function renderRegistrationForm(): RenderResult {
    return render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <GoogleReCaptchaProvider reCaptchaKey="123">
            <RegistrationForm onRegistrationFinished={jest.fn()} />
          </GoogleReCaptchaProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );
  }

  function fillTheForm(
    wrapper: RenderResult,
    change?: Partial<RegistrationData>,
  ) {
    const defaults: RegistrationData = {
      firstName: 'Lebron',
      lastName: 'James',
      email: 'lj@nba.com',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssw0rd',
      accountName: 'Los Angeles Lakers',
      jobTitle: 'Teacher',
      country: 'Poland',
      typeOfOrg: 'EdTech',
      audience: 'K12',
      discoveryMethod: 'Teacher',
      desiredContent: 'Maths',
      hasAcceptedEducationalUseTerms: true,
    };

    fillRegistrationForm(wrapper, { ...defaults, ...change });
  }

  async function checkErrorIsNotVisible(
    wrapper: RenderResult,
    errorMessage: string,
  ) {
    await waitFor(async () => {
      expect(wrapper.queryByText(errorMessage)).not.toBeInTheDocument();
    });
  }

  async function checkErrorIsVisible(
    wrapper: RenderResult,
    errorMessage: string,
  ) {
    await waitFor(async () => {
      expect(wrapper.getByText(errorMessage)).toBeVisible();
    });
  }
});
