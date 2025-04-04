import '../../common/mockRecaptcha';
import { render, RenderResult, waitFor } from '@testing-library/react';
import React from 'react';
import DistrictRegistrationForm, {
  DistrictRegistrationData,
} from 'src/components/classroom/registration/district/registrationForm/DistrictRegistrationForm';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import {
  fillRegistrationForm,
  setComboboxDropdownValue,
} from 'src/components/classroom/registration/district/registrationForm/districtRegistrationFormTestHelpers';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('DistrictRegistration Form Validation', () => {
  const fakeClient = new FakeBoclipsClient();
  const createDistrictUserSpy = jest.spyOn(
    fakeClient.users,
    'createDistrictUser',
  );

  beforeEach(() => {
    fakeClient.districts.setUsaDistricts({
      CA: [
        {
          externalId: 'district-1',
          name: 'Los Angeles Lakers',
          city: 'Los Angeles',
        },
      ],
    });
  });

  it('first name cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    await fillTheForm(wrapper, { firstName: '' });

    await checkErrorIsNotVisible(wrapper, 'First name is required');
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );
    await checkErrorIsVisible(wrapper, 'First name is required');

    await waitFor(() => {
      expect(createDistrictUserSpy).not.toBeCalled();
    });
  });

  it('last name cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    await fillTheForm(wrapper, { lastName: '' });

    await checkErrorIsNotVisible(wrapper, 'Last name is required');
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );
    await checkErrorIsVisible(wrapper, 'Last name is required');

    await waitFor(() => {
      expect(createDistrictUserSpy).not.toBeCalled();
    });
  });

  describe('email', () => {
    it('email cannot be empty', async () => {
      const wrapper = renderRegistrationForm();

      await fillTheForm(wrapper, { email: '' });

      await checkErrorIsNotVisible(wrapper, 'Email is required');
      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );
      await checkErrorIsVisible(wrapper, 'Email is required');

      await waitFor(() => {
        expect(createDistrictUserSpy).not.toBeCalled();
      });
    });

    it('email must have correct format', async () => {
      const wrapper = renderRegistrationForm();

      await checkErrorIsNotVisible(
        wrapper,
        'Please enter a valid email address',
      );

      await fillTheForm(wrapper, { email: 'wrong@' });
      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );

      await checkErrorIsVisible(wrapper, 'Please enter a valid email address');

      await waitFor(() => {
        expect(createDistrictUserSpy).not.toBeCalled();
      });
    });
  });

  describe('district name', () => {
    it('district name cannot be empty', async () => {
      const wrapper = renderRegistrationForm();

      await fillTheForm(wrapper, { districtName: '' });

      await checkErrorIsNotVisible(wrapper, 'District name is required');
      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );
      await checkErrorIsVisible(wrapper, 'District name is required');

      await waitFor(() => {
        expect(createDistrictUserSpy).not.toBeCalled();
      });
    });

    it('clears error when district name is filled', async () => {
      fakeClient.districts.setUsaDistricts({
        AR: [
          {
            externalId: 'district-1',
            name: 'Lincoln District',
            city: 'Los Angeles',
          },
          {
            externalId: 'district-2',
            name: 'Harris District',
            city: 'Hot Springs',
          },
        ],
      });
      const wrapper = renderRegistrationForm();
      await fillTheForm(wrapper, {
        state: 'Arkansas',
        districtName: '',
      });
      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );

      await checkErrorIsVisible(wrapper, 'District name is required');

      await setComboboxDropdownValue(
        wrapper,
        'input-dropdown-districtName',
        'Lincoln District, Los Angeles',
      );

      await checkErrorIsNotVisible(wrapper, 'District name is required');

      await waitFor(() => {
        expect(createDistrictUserSpy).not.toBeCalled();
      });
    });
  });

  describe('password', () => {
    it('password cannot be empty', async () => {
      const wrapper = renderRegistrationForm();

      await fillTheForm(wrapper, { password: '' });

      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );
      await checkErrorIsVisible(wrapper, '8 characters');

      await waitFor(() => {
        expect(createDistrictUserSpy).not.toBeCalled();
      });
    });

    it('password must be strong', async () => {
      const wrapper = renderRegistrationForm();

      await fillTheForm(wrapper, { password: 'pass' });

      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );

      await checkErrorIsVisible(wrapper, '8 characters');
      await checkErrorIsVisible(wrapper, '1 capital letter');
      await checkErrorIsVisible(wrapper, "Password doesn't match");
      await checkErrorIsVisible(wrapper, '1 special character');
      await checkErrorIsVisible(wrapper, '1 number');

      await waitFor(() => {
        expect(createDistrictUserSpy).not.toBeCalled();
      });
    });

    it('passwords must match ', async () => {
      const wrapper = renderRegistrationForm();

      await fillTheForm(wrapper, {
        password: 'abc@5678',
        confirmPassword: 'def',
      });

      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );
      await checkErrorIsVisible(wrapper, "Password doesn't match");

      await waitFor(() => {
        expect(createDistrictUserSpy).not.toBeCalled();
      });
    });
  });

  describe('state', () => {
    it('state cannot be empty', async () => {
      const wrapper = renderRegistrationForm();

      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );
      await checkErrorIsVisible(wrapper, 'Please select a state');

      await waitFor(() => {
        expect(createDistrictUserSpy).not.toBeCalled();
      });
    });

    it('clears states error when filled', async () => {
      const wrapper = renderRegistrationForm();

      await fillTheForm(wrapper, {
        state: '',
        districtName: '',
      });

      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );
      await checkErrorIsVisible(wrapper, 'Please select a state');

      await setComboboxDropdownValue(
        wrapper,
        'input-dropdown-state',
        'Florida',
      );

      await checkErrorIsNotVisible(wrapper, 'Please select a state');
    });
  });

  it('prompts user to check educational use checkbox if not checked and user clicks submit', async () => {
    const wrapper = renderRegistrationForm();

    await fillTheForm(wrapper, { hasAcceptedEducationalUseTerms: false });

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    expect(
      await wrapper.findByText('Educational use agreement is required'),
    ).toBeVisible();

    expect(createDistrictUserSpy).not.toBeCalled();
  });

  it('prompts user to check boclips Ts and Cs checkbox if not checked and user clicks submit', async () => {
    const wrapper = renderRegistrationForm();

    await fillTheForm(wrapper, { hasAcceptedTermsAndConditions: false });

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    expect(
      await wrapper.findByText(
        'Boclips Terms and Conditions agreement is required',
      ),
    ).toBeVisible();

    expect(createDistrictUserSpy).not.toBeCalled();
  });

  it('displays error message if email already exists', async () => {
    jest
      .spyOn(fakeClient.users, 'createDistrictUser')
      .mockImplementation(() =>
        Promise.reject(new Error('User already exists for account: Boclips')),
      );

    const wrapper = renderRegistrationForm();
    await fillTheForm(wrapper, { email: 'existing@email.com' });

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    expect(await wrapper.findByText('Email already exists')).toBeVisible();
  });

  it('displays error message if account name already exists', async () => {
    jest
      .spyOn(fakeClient.users, 'createDistrictUser')
      .mockImplementation(() =>
        Promise.reject(
          new Error('Account Los Angeles Lakers, Los Angeles already exists'),
        ),
      );

    const wrapper = renderRegistrationForm();
    await fillTheForm(wrapper, {});

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    expect(
      await wrapper.findByText(
        'Cannot use this district name. Try another or contact us.',
      ),
    ).toBeVisible();
  });

  it('clears errors when form is fixed', async () => {
    const wrapper = renderRegistrationForm();

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    await checkErrorIsVisible(wrapper, 'Please select a state');
    await checkErrorIsVisible(wrapper, 'First name is required');
    await checkErrorIsVisible(wrapper, 'Last name is required');
    await checkErrorIsVisible(wrapper, 'Email is required');
    expect(wrapper.getAllByText('Password is required')[0]).toBeVisible();
    await checkErrorIsVisible(wrapper, '8 characters');
    await checkErrorIsVisible(wrapper, '1 capital letter');
    await checkErrorIsVisible(wrapper, '1 special character');
    await checkErrorIsVisible(wrapper, '1 number');
    await checkErrorIsVisible(wrapper, 'Please select a usage frequency');
    await checkErrorIsVisible(
      wrapper,
      'Please select an instructional video source',
    );
    await checkErrorIsVisible(wrapper, 'Please select one or more barriers');
    await checkErrorIsVisible(wrapper, 'Please select one or more subjects');
    await checkErrorIsVisible(wrapper, 'Please select a reason');
    await checkErrorIsVisible(wrapper, 'Educational use agreement is required');
    await checkErrorIsVisible(
      wrapper,
      'Boclips Terms and Conditions agreement is required',
    );

    await fillTheForm(wrapper, {});
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    await checkErrorIsNotVisible(wrapper, 'Please select a state');
    await checkErrorIsNotVisible(wrapper, 'First name is required');
    await checkErrorIsNotVisible(wrapper, 'Last name is required');
    await checkErrorIsNotVisible(wrapper, 'Email is required');
    await checkErrorIsNotVisible(wrapper, 'Password is required');
    await checkErrorIsNotVisible(wrapper, 'Please select a usage frequency');
    await checkErrorIsNotVisible(
      wrapper,
      'Please select an instructional video source',
    );
    await checkErrorIsNotVisible(wrapper, 'Please select one or more barriers');
    await checkErrorIsNotVisible(wrapper, 'Please select one or more subjects');
    await checkErrorIsNotVisible(wrapper, 'Please select a reason');
    await checkErrorIsNotVisible(
      wrapper,
      'Educational use agreement is required',
    );
    await checkErrorIsNotVisible(
      wrapper,
      'Boclips Terms and Conditions agreement is required',
    );

    await waitFor(() => {
      expect(createDistrictUserSpy).toBeCalled();
    });
  });

  function renderRegistrationForm(): RenderResult {
    return render(
      <Router>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsClientProvider client={fakeClient}>
            <GoogleReCaptchaProvider reCaptchaKey="123">
              <DistrictRegistrationForm onRegistrationFinished={jest.fn()} />
            </GoogleReCaptchaProvider>
          </BoclipsClientProvider>
        </QueryClientProvider>
      </Router>,
    );
  }

  async function fillTheForm(
    wrapper: RenderResult,
    change?: Partial<DistrictRegistrationData>,
  ) {
    const defaults: DistrictRegistrationData = {
      firstName: 'Lebron',
      lastName: 'James',
      email: 'lj@nba.com',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssw0rd',
      districtName: 'Los Angeles Lakers, Los Angeles',
      state: 'California',
      hasAcceptedEducationalUseTerms: true,
      hasAcceptedTermsAndConditions: true,
      ncesDistrictId: '',
      usageFrequency: 'Very rarely',
      instructionalVideoSource: 'YouTube',
      videoResourceBarriers: ['Misinformation/disinformation'],
      subjects: ['Math'],
      reason: 'It’s hard to find standards aligned videos',
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
