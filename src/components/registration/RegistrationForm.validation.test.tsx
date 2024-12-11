import './mockRecaptcha';
import { render, RenderResult, waitFor } from '@testing-library/react';
import React from 'react';
import RegistrationForm, {
  RegistrationData,
} from '@components/registration/registrationForm/RegistrationForm';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { fillRegistrationForm } from '@components/registration/registrationFormTestHelpers';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from "@testing-library/user-event";

describe('Registration Form Validation', () => {
  const fakeClient = new FakeBoclipsClient();
  const createTrialUserSpy = vi.spyOn(fakeClient.users, 'createTrialUser');

  it('first name cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { firstName: '' });

    await checkErrorIsNotVisible(wrapper, 'First name is required');
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );
    await checkErrorIsVisible(wrapper, 'First name is required');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('last name cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { lastName: '' });

    await checkErrorIsNotVisible(wrapper, 'Last name is required');
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );
    await checkErrorIsVisible(wrapper, 'Last name is required');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('email cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { email: '' });

    await checkErrorIsNotVisible(wrapper, 'Email is required');
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );
    await checkErrorIsVisible(wrapper, 'Email is required');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('email must have correct format', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { email: 'wrong@' });

    await checkErrorIsNotVisible(wrapper, 'Please enter a valid email address');
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );
    await checkErrorIsVisible(wrapper, 'Please enter a valid email address');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('account name cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { accountName: '' });

    await checkErrorIsNotVisible(wrapper, 'Organization name is required');
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );
    await checkErrorIsVisible(wrapper, 'Organization name is required');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('password cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { password: '' });

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );
    await checkErrorIsVisible(wrapper, '8 characters');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('password must be strong', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { password: 'pass' });

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    await checkErrorIsVisible(wrapper, '8 characters');
    await checkErrorIsVisible(wrapper, '1 capital letter');
    await checkErrorIsVisible(wrapper, "Password doesn't match");
    await checkErrorIsVisible(wrapper, '1 special character');
    await checkErrorIsVisible(wrapper, '1 number');

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

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );
    await checkErrorIsVisible(wrapper, "Password doesn't match");

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('country cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { country: '' });

    await checkErrorIsNotVisible(wrapper, 'Please select a country');
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );
    await checkErrorIsVisible(wrapper, 'Please select a country');

    await waitFor(() => {
      expect(createTrialUserSpy).not.toBeCalled();
    });
  });

  it('prompts user to check educational use checkbox if not checked and user clicks submit', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { hasAcceptedEducationalUseTerms: false });

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    expect(
      await wrapper.findByText('Educational use agreement is required'),
    ).toBeVisible();

    expect(createTrialUserSpy).not.toBeCalled();
  });

  it('prompts user to check boclips Ts and Cs checkbox if not checked and user clicks submit', async () => {
    const wrapper = renderRegistrationForm();

    fillTheForm(wrapper, { hasAcceptedTermsAndConditions: false });

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    expect(
      await wrapper.findByText(
        'Boclips Terms and Conditions agreement is required',
      ),
    ).toBeVisible();

    expect(createTrialUserSpy).not.toBeCalled();
  });

  it('displays error message if email already exists', async () => {
    vi.spyOn(fakeClient.users, 'createTrialUser').mockImplementation(() =>
      Promise.reject(new Error('User already exists for account: Boclips')),
    );

    const wrapper = renderRegistrationForm();
    fillTheForm(wrapper, { email: 'existing@email.com' });

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    expect(await wrapper.findByText('Email already exists')).toBeVisible();
  });

  it('displays error message if account name already exists', async () => {
    vi.spyOn(fakeClient.users, 'createTrialUser').mockImplementation(() =>
      Promise.reject(new Error('Account Boclips already exists')),
    );

    const wrapper = renderRegistrationForm();
    fillTheForm(wrapper, { accountName: 'Boclips' });

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    expect(
      await wrapper.findByText(
        'Cannot use this organization name. Try another or contact us.',
      ),
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
      email: '',
      hasAcceptedEducationalUseTerms: false,
      hasAcceptedTermsAndConditions: false,
    });

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    await checkErrorIsVisible(wrapper, 'First name is required');
    await checkErrorIsVisible(wrapper, 'Last name is required');
    await checkErrorIsVisible(wrapper, 'Email is required');
    await checkErrorIsVisible(wrapper, 'Organization name is required');
    await checkErrorIsVisible(wrapper, '8 characters');
    await checkErrorIsVisible(wrapper, '1 capital letter');
    await checkErrorIsVisible(wrapper, "Password doesn't match");
    await checkErrorIsVisible(wrapper, '1 special character');
    await checkErrorIsVisible(wrapper, '1 number');
    await checkErrorIsVisible(wrapper, 'Please select a country');
    await checkErrorIsVisible(wrapper, 'Educational use agreement is required');
    await checkErrorIsVisible(
      wrapper,
      'Boclips Terms and Conditions agreement is required',
    );

    fillTheForm(wrapper, {});
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    await checkErrorIsNotVisible(wrapper, 'First name is required');
    await checkErrorIsNotVisible(wrapper, 'Last name is required');
    await checkErrorIsNotVisible(wrapper, 'Email is required');
    await checkErrorIsNotVisible(wrapper, 'Organization name is required');
    await checkErrorIsNotVisible(wrapper, 'Password is required');
    await checkErrorIsNotVisible(wrapper, 'Please select a country');
    await checkErrorIsNotVisible(
      wrapper,
      'Please select a type of organisation',
    );
    await checkErrorIsNotVisible(
      wrapper,
      'Educational use agreement is required',
    );
    await checkErrorIsNotVisible(
      wrapper,
      'Boclips Terms and Conditions agreement is required',
    );

    await waitFor(() => {
      expect(createTrialUserSpy).toBeCalled();
    });
  });

  function renderRegistrationForm(): RenderResult {
    return render(
      <Router>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsClientProvider client={fakeClient}>
            <GoogleReCaptchaProvider reCaptchaKey="123">
              <RegistrationForm onRegistrationFinished={vi.fn()} />
            </GoogleReCaptchaProvider>
          </BoclipsClientProvider>
        </QueryClientProvider>
      </Router>,
    );
  }

  async function fillTheForm(
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
      country: 'Poland',
      hasAcceptedEducationalUseTerms: true,
      hasAcceptedTermsAndConditions: true,
    };

    await fillRegistrationForm(wrapper, { ...defaults, ...change });
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
