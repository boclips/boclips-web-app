import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import DistrictRegistrationForm, {
  DistrictRegistrationData,
} from 'src/components/classroom/registration/district/registrationForm/DistrictRegistrationForm';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { ToastContainer } from 'react-toastify';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import {
  fillRegistrationForm,
  setTextFieldValue,
} from 'src/components/classroom/registration/district/registrationForm/districtRegistrationFormTestHelpers';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const mockExecuteRecaptcha = jest.fn((_?: string) =>
  Promise.resolve('token_baby'),
);

jest.mock('react-google-recaptcha-v3', () => {
  return {
    GoogleReCaptchaProvider: ({ children }: any): React.JSX.Element => {
      return <>{children}</>;
    },
    useGoogleReCaptcha: () => ({
      executeRecaptcha: mockExecuteRecaptcha,
    }),
  };
});

describe('DistrictRegistration Form', () => {
  async function fillTheForm(
    wrapper: RenderResult,
    change?: Partial<DistrictRegistrationData>,
  ) {
    const defaults: DistrictRegistrationData = {
      firstName: 'LeBron',
      lastName: 'James',
      email: 'lj@nba.com',
      password: 'p@ss1234',
      confirmPassword: 'p@ss1234',
      districtName: 'Lincoln District, Little Rock',
      state: 'Arkansas',
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

  const fakeClient = new FakeBoclipsClient();
  beforeEach(() => {
    fakeClient.districts.setUsaDistricts({
      AR: [
        {
          externalId: 'district-1',
          name: 'Lincoln District',
          city: 'Little Rock',
        },
        {
          externalId: 'district-2',
          name: 'Harris Elementary District',
          city: 'Hot Springs',
        },
      ],
    });
  });

  it('renders the form', async () => {
    const wrapper = renderRegistrationForm();

    expect(wrapper.getByText('Create a US Pilot Trial Account')).toBeVisible();
    expect(
      wrapper.getByText(
        'Please register below to create your district pilot trial account.',
      ),
    ).toBeVisible();
    expect(wrapper.getByText('Schedule a consultation')).toBeVisible();
    expect(wrapper.getByLabelText('First name')).toBeVisible();
    expect(wrapper.getByLabelText('Last name')).toBeVisible();
    expect(wrapper.getByLabelText('Email Address')).toBeVisible();
    expect(wrapper.getByLabelText('Password')).toBeVisible();
    expect(wrapper.getByLabelText('Confirm password')).toBeVisible();
    expect(
      wrapper.getByLabelText(
        /I certify that I am accessing this service solely for Educational Use./,
      ),
    ).toBeVisible();

    expect(
      wrapper.getByLabelText(
        /"Educational Use" is defined as to copy, communicate, edit, and\/or incorporate into a publication or digital product for a learning outcome./,
      ),
    ).toBeVisible();
    expect(wrapper.queryByTestId('input-dropdown-state')).toBeVisible();

    expect(
      wrapper.getByTestId('input-checkbox-educational-use-agreement'),
    ).toBeVisible();

    expect(
      wrapper.getByTestId('input-checkbox-boclips-terms-conditions'),
    ).toBeVisible();

    expect(
      wrapper.getByRole('button', { name: 'Create Account' }),
    ).toBeVisible();
  });

  it('renders log in link', async () => {
    const wrapper = renderRegistrationForm();

    expect(wrapper.getByText('Have an account?')).toBeVisible();
    expect(wrapper.getByText('Log in')).toBeVisible();
    expect(wrapper.getByText('Log in').closest('a')).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('renders support email', async () => {
    const wrapper = renderRegistrationForm();

    expect(wrapper.getByText('Having trouble? Contact us at')).toBeVisible();
    expect(wrapper.getByText('support@boclips.com')).toBeVisible();
    expect(
      wrapper.getByText('support@boclips.com').closest('a'),
    ).toHaveAttribute('href', 'mailto:support@boclips.com');
  });

  it('sends selected usa district and id', async () => {
    const createDistrictUserSpy = jest.spyOn(
      fakeClient.users,
      'createDistrictUser',
    );

    const wrapper = renderRegistrationForm(fakeClient);

    await fillTheForm(wrapper, {});

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    await waitFor(() => {
      expect(createDistrictUserSpy).toBeCalledWith({
        firstName: 'LeBron',
        lastName: 'James',
        email: 'lj@nba.com',
        password: 'p@ss1234',
        recaptchaToken: 'token_baby',
        type: UserType.districtUser,
        districtName: 'Lincoln District, Little Rock',
        country: 'USA',
        state: 'AR',
        ncesDistrictId: 'district-1',
        hasAcceptedEducationalUseTerms: true,
        hasAcceptedTermsAndConditions: true,
        districtPilotInformation: {
          usageFrequency: 'Very rarely',
          instructionalVideoSource: 'YouTube',
          videoResourceBarriers: ['Misinformation/disinformation'],
          subjects: ['Math'],
          reason: 'It’s hard to find standards aligned videos',
        },
      });
    });
  });

  it('error notification is displayed when classroom user creation fails, inputs are not cleared', async () => {
    jest
      .spyOn(fakeClient.users, 'createDistrictUser')
      .mockImplementation(() => Promise.reject());

    const wrapper = render(
      <Router>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsClientProvider client={fakeClient}>
            <ToastContainer />
            <GoogleReCaptchaProvider reCaptchaKey="123">
              <DistrictRegistrationForm onRegistrationFinished={jest.fn()} />
            </GoogleReCaptchaProvider>
          </BoclipsClientProvider>
        </QueryClientProvider>
      </Router>,
    );

    await fillTheForm(wrapper, {});

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(await wrapper.findByText('User creation failed')).toBeVisible();

    expect(wrapper.getByDisplayValue('LeBron')).toBeVisible();
    expect(wrapper.getByDisplayValue('James')).toBeVisible();
    expect(wrapper.getByDisplayValue('lj@nba.com')).toBeVisible();
    expect(wrapper.getAllByDisplayValue('p@ss1234')).toHaveLength(2);
  });

  it('onRegistrationFinished is called when classroom user creation passes', async () => {
    jest.spyOn(fakeClient.users, 'createDistrictUser').mockImplementation(() =>
      Promise.resolve(
        UserFactory.sample({
          email: 'test@boclips.com',
        }),
      ),
    );

    const onRegistrationFinishedSpy = jest.fn();

    const wrapper = renderRegistrationForm(
      fakeClient,
      onRegistrationFinishedSpy,
    );

    await fillTheForm(wrapper, {});

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(onRegistrationFinishedSpy).toBeCalledTimes(1);
      expect(onRegistrationFinishedSpy).toBeCalledWith('test@boclips.com');
    });
  });

  it('displays error notification if captcha fails', async () => {
    mockExecuteRecaptcha.mockImplementationOnce((_?: string) =>
      Promise.reject(new Error('Recaptcha error')),
    );

    const wrapper = render(
      <Router>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsClientProvider client={fakeClient}>
            <ToastContainer />
            <GoogleReCaptchaProvider reCaptchaKey="123">
              <DistrictRegistrationForm onRegistrationFinished={jest.fn()} />
            </GoogleReCaptchaProvider>
          </BoclipsClientProvider>
        </QueryClientProvider>
      </Router>,
    );

    await fillTheForm(wrapper, {});

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(
      await wrapper.findByText(
        'There was an error with our security verification. Please try again later.',
      ),
    ).toBeVisible();
  });

  it('validation errors are cleared on filling in the field', async () => {
    const wrapper = renderRegistrationForm(fakeClient);

    await fillTheForm(wrapper, { firstName: '' });

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    expect(await wrapper.findByText('First name is required')).toBeVisible();

    await userEvent.click(
      wrapper.getByRole('textbox', {
        name: 'First name First name is required',
      }),
    );

    await setTextFieldValue(
      wrapper.container.querySelector('[id="input-firstName"]'),
      'Martha',
    );

    expect(wrapper.queryByText('First name is required')).toBeNull();
  });

  function renderRegistrationForm(
    apiClient: FakeBoclipsClient = new FakeBoclipsClient(),
    registrationFormSpy: (userEmail: string) => void = jest.fn(),
  ) {
    return render(
      <Router>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsClientProvider client={apiClient}>
            <GoogleReCaptchaProvider reCaptchaKey="123">
              <DistrictRegistrationForm
                onRegistrationFinished={registrationFormSpy}
              />
            </GoogleReCaptchaProvider>
          </BoclipsClientProvider>
        </QueryClientProvider>
      </Router>,
    );
  }
});
