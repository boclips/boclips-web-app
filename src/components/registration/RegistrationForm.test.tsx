import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
  within,
} from '@testing-library/react';
import React from 'react';
import RegistrationForm from 'src/components/registration/RegistrationForm';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { ToastContainer } from 'react-toastify';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

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

describe('Registration Form', () => {
  it('renders the form', async () => {
    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <GoogleReCaptchaProvider reCaptchaKey="123">
            <RegistrationForm />
          </GoogleReCaptchaProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    expect(wrapper.getByText('CourseSpark')).toBeVisible();
    expect(wrapper.getByText('Create new account')).toBeVisible();
    expect(wrapper.getByText('7 day trial')).toBeVisible();
    expect(wrapper.getByLabelText('First name')).toBeVisible();
    expect(wrapper.getByLabelText('Last name')).toBeVisible();
    expect(wrapper.getByLabelText('Professional email')).toBeVisible();
    expect(wrapper.getByLabelText('Password')).toBeVisible();
    expect(wrapper.getByLabelText('Confirm password')).toBeVisible();
    expect(wrapper.getByLabelText('Account name')).toBeVisible();
    expect(
      wrapper.getByLabelText(
        'I certify that I am accessing this service solely for Educational Use. ' +
          '"Educational Use" is defined as to copy, communicate, edit, and/or ' +
          'incorporate into a publication or digital product for a learning outcome',
      ),
    ).toBeVisible();
    expect(wrapper.getByTestId('input-dropdown-job-title')).toBeVisible();
    expect(wrapper.getByTestId('input-dropdown-country')).toBeVisible();
    expect(wrapper.getByTestId('input-dropdown-audience')).toBeVisible();
    expect(wrapper.getByTestId('input-dropdown-type-of-org')).toBeVisible();
    expect(
      wrapper.getByTestId('input-checkbox-educational-use-agreement'),
    ).toBeVisible();
    expect(
      wrapper.getByLabelText('What content are you looking for?'),
    ).toBeVisible();

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
          <GoogleReCaptchaProvider reCaptchaKey="123">
            <RegistrationForm />
          </GoogleReCaptchaProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    fillRegistrationForm(wrapper);
    checkEducationalUseAgreement(wrapper);

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(createTrialUserSpy).toBeCalledWith({
        firstName: 'LeBron',
        lastName: 'James',
        email: 'lj@nba.com',
        password: 'p@ss',
        recaptchaToken: 'token_baby',
        type: UserType.trialB2bUser,
        accountName: 'Los Angeles Lakers',
        jobTitle: 'Teacher',
        marketingInformation: {
          country: 'POL',
          organisationType: 'EdTech',
          audience: 'K12',
          discoveryMethod: 'Teacher',
          desiredContent: 'Maths',
        },
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
          <GoogleReCaptchaProvider reCaptchaKey="123">
            <RegistrationForm />
          </GoogleReCaptchaProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    fillRegistrationForm(wrapper);
    checkEducationalUseAgreement(wrapper);

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(await wrapper.findByText('User creation failed')).toBeVisible();

    expect(wrapper.getByDisplayValue('LeBron')).toBeVisible();
    expect(wrapper.getByDisplayValue('James')).toBeVisible();
    expect(wrapper.getByDisplayValue('lj@nba.com')).toBeVisible();
    expect(wrapper.getAllByDisplayValue('p@ss')).toHaveLength(2);
  });

  it('success notification is displayed when trial user creation passes', async () => {
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
          <GoogleReCaptchaProvider reCaptchaKey="123">
            <RegistrationForm />
          </GoogleReCaptchaProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    fillRegistrationForm(wrapper);
    checkEducationalUseAgreement(wrapper);

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(
      await wrapper.findByText('User test@boclips.com successfully created'),
    ).toBeVisible();
  });

  it('displays error notification if captcha fails', async () => {
    mockExecuteRecaptcha.mockImplementationOnce((_?: string) =>
      Promise.reject(new Error('Recaptcha error')),
    );

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={new FakeBoclipsClient()}>
          <ToastContainer />
          <GoogleReCaptchaProvider reCaptchaKey="123">
            <RegistrationForm />
          </GoogleReCaptchaProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    fillRegistrationForm(wrapper);
    checkEducationalUseAgreement(wrapper);

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(
      await wrapper.findByText(
        'There was an error with our security verification. Please try again later.',
      ),
    ).toBeVisible();
  });

  it('prompts user to check educational use checkbox if not checked and user clicks submit', async () => {
    const fakeClient = new FakeBoclipsClient();
    const createTrialUserSpy = jest.spyOn(fakeClient.users, 'createTrialUser');

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <ToastContainer />
          <GoogleReCaptchaProvider reCaptchaKey="123">
            <RegistrationForm />
          </GoogleReCaptchaProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    fillRegistrationForm(wrapper);
    expect(
      wrapper.queryByText('Educational use agreement is mandatory'),
    ).toBeNull();

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(
      await wrapper.findByText('Educational use agreement is mandatory'),
    ).toBeVisible();
    expect(createTrialUserSpy).not.toBeCalled();
  });

  function fillRegistrationForm(
    wrapper: RenderResult,
    firstName = 'LeBron',
    lastName = 'James',
    email = 'lj@nba.com',
    password = 'p@ss',
    confirmPassword = 'p@ss',
    accountName = 'Los Angeles Lakers',
    jobTitle = 'Teacher',
    country = 'Poland',
    typeOfOrg = 'EdTech',
    audience = 'K12',
    discoveryMethod = 'Teacher',
    desiredContent = 'Maths',
  ) {
    fireEvent.change(wrapper.getByLabelText('First name'), {
      target: { value: firstName },
    });
    fireEvent.change(wrapper.getByLabelText('Last name'), {
      target: { value: lastName },
    });
    fireEvent.change(wrapper.getByLabelText('Professional email'), {
      target: { value: email },
    });
    fireEvent.change(wrapper.getByLabelText('Password'), {
      target: { value: password },
    });
    fireEvent.change(wrapper.getByLabelText('Confirm password'), {
      target: { value: confirmPassword },
    });
    fireEvent.change(wrapper.getByLabelText('Account name'), {
      target: { value: accountName },
    });

    const jobTitleDropdown = wrapper.getByTestId('input-dropdown-job-title');
    fireEvent.click(within(jobTitleDropdown).getByTestId('select'));
    fireEvent.click(within(jobTitleDropdown).getByText(jobTitle));

    const countryDropdown = wrapper.getByTestId('input-dropdown-country');
    fireEvent.click(within(countryDropdown).getByTestId('select'));
    fireEvent.click(within(countryDropdown).getByText(country));

    const typeOfOrgDropdown = wrapper.getByTestId('input-dropdown-type-of-org');
    fireEvent.click(within(typeOfOrgDropdown).getByTestId('select'));
    fireEvent.click(within(typeOfOrgDropdown).getByText(typeOfOrg));

    const audienceDropdown = wrapper.getByTestId('input-dropdown-audience');
    fireEvent.click(within(audienceDropdown).getByTestId('select'));
    fireEvent.click(within(audienceDropdown).getByText(audience));

    fireEvent.change(
      wrapper.getByLabelText('How did you hear about Boclips?'),
      {
        target: { value: discoveryMethod },
      },
    );

    fireEvent.change(
      wrapper.getByLabelText('What content are you looking for?'),
      {
        target: { value: desiredContent },
      },
    );
  }
  const checkEducationalUseAgreement = (wrapper: RenderResult) => {
    fireEvent.click(
      wrapper.getByLabelText(
        'I certify that I am accessing this service solely for Educational Use. ' +
          '"Educational Use" is defined as to copy, communicate, edit, and/or ' +
          'incorporate into a publication or digital product for a learning outcome',
      ),
    );
  };
});
