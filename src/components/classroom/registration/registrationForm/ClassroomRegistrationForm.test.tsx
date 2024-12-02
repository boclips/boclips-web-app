import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import ClassroomRegistrationForm, {
  ClassroomRegistrationData,
} from '@src/components/classroom/registration/registrationForm/ClassroomRegistrationForm';
import { BoclipsClientProvider } from '@src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserType } from 'boclips-api-client/dist/sub-clients/users/model/CreateUserRequest';
import { ToastContainer } from 'react-toastify';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import {
  fillRegistrationForm,
  SchoolMode,
  setDropdownValue,
  setTextFieldValue,
} from '@src/components/classroom/registration/registrationForm/classroomRegistrationFormTestHelpers';
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

describe('ClassroomRegistration Form', () => {
  async function fillTheForm(
    wrapper: RenderResult,
    change?: Partial<ClassroomRegistrationData>,
    schoolMode: SchoolMode = SchoolMode.FREE_TEXT,
  ) {
    const defaults: ClassroomRegistrationData = {
      firstName: 'LeBron',
      lastName: 'James',
      email: 'lj@nba.com',
      password: 'p@ss1234',
      confirmPassword: 'p@ss1234',
      schoolName: 'Los Angeles Lakers',
      country: 'Poland',
      state: '',
      hasAcceptedEducationalUseTerms: true,
      hasAcceptedTermsAndConditions: true,
    };

    await fillRegistrationForm(wrapper, { ...defaults, ...change }, schoolMode);
  }

  it('renders the form', async () => {
    const wrapper = renderRegistrationForm();

    expect(wrapper.getByText('Create your free account')).toBeVisible();
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

    expect(wrapper.getByTestId('input-dropdown-country')).toBeVisible();

    expect(wrapper.queryByTestId('input-dropdown-state')).toBeNull();

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

  it('displays the state drop down on selecting USA', async () => {
    const wrapper = renderRegistrationForm();

    expect(wrapper.getByTestId('input-dropdown-country')).toBeVisible();
    expect(wrapper.queryByTestId('input-dropdown-state')).toBeNull();

    await setDropdownValue(
      wrapper,
      'input-dropdown-country',
      'United States of America',
    );

    expect(wrapper.getByTestId('input-dropdown-state')).toBeVisible();
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

  it('typed values and checkboxes values are submitted when Create Account button is clicked', async () => {
    const fakeClient = new FakeBoclipsClient();
    const createClassroomUserSpy = jest.spyOn(
      fakeClient.users,
      'createClassroomUser',
    );

    const wrapper = renderRegistrationForm(fakeClient);

    await fillTheForm(wrapper, {});

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(createClassroomUserSpy).toBeCalledWith({
        firstName: 'LeBron',
        lastName: 'James',
        email: 'lj@nba.com',
        password: 'p@ss1234',
        recaptchaToken: 'token_baby',
        type: UserType.classroomUser,
        schoolName: 'Los Angeles Lakers',
        country: 'POL',
        state: '',
        hasAcceptedEducationalUseTerms: true,
        hasAcceptedTermsAndConditions: true,
      });
    });
  });

  it('does not send through the state or nces school ID when USA, state and school dropdown are selected and then a different country is selected', async () => {
    const fakeClient = new FakeBoclipsClient();
    const createClassroomUserSpy = jest.spyOn(
      fakeClient.users,
      'createClassroomUser',
    );
    fakeClient.schools.setUsaSchools({
      AR: [
        {
          externalId: 'school-1',
          name: 'Lincoln High School',
          city: 'Little Rock',
        },
        {
          externalId: 'school-2',
          name: 'Harris Elementary School',
          city: 'Hot Springs',
        },
      ],
    });

    const wrapper = renderRegistrationForm(fakeClient);

    await fillTheForm(
      wrapper,
      {
        country: 'United States of America',
        state: 'Arkansas',
        schoolName: 'Lincoln High School, Little Rock',
      },
      SchoolMode.DROPDOWN_VALUE,
    );

    await setDropdownValue(wrapper, 'input-dropdown-country', 'Sri Lanka');
    await setTextFieldValue(
      wrapper.container.querySelector('[id="input-schoolName"]'),
      'Los Angeles Lakers',
    );

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    await waitFor(() => {
      expect(createClassroomUserSpy).toBeCalledWith({
        firstName: 'LeBron',
        lastName: 'James',
        email: 'lj@nba.com',
        password: 'p@ss1234',
        recaptchaToken: 'token_baby',
        type: UserType.classroomUser,
        schoolName: 'Los Angeles Lakers',
        country: 'LKA',
        state: '',
        ncesSchoolId: undefined,
        hasAcceptedEducationalUseTerms: true,
        hasAcceptedTermsAndConditions: true,
      });
    });
  });

  it('sends selected usa school and id when country usa and a state are selected', async () => {
    const fakeClient = new FakeBoclipsClient();
    const createClassroomUserSpy = jest.spyOn(
      fakeClient.users,
      'createClassroomUser',
    );
    fakeClient.schools.setUsaSchools({
      AR: [
        {
          externalId: 'school-1',
          name: 'Lincoln High School',
          city: 'Little Rock',
        },
        {
          externalId: 'school-2',
          name: 'Harris Elementary School',
          city: 'Hot Springs',
        },
      ],
    });

    const wrapper = renderRegistrationForm(fakeClient);

    await fillTheForm(
      wrapper,
      {
        country: 'United States of America',
        state: 'Arkansas',
        schoolName: 'Lincoln High School, Little Rock',
      },
      SchoolMode.DROPDOWN_VALUE,
    );

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    await waitFor(() => {
      expect(createClassroomUserSpy).toBeCalledWith({
        firstName: 'LeBron',
        lastName: 'James',
        email: 'lj@nba.com',
        password: 'p@ss1234',
        recaptchaToken: 'token_baby',
        type: UserType.classroomUser,
        schoolName: 'Lincoln High School, Little Rock',
        country: 'USA',
        state: 'AR',
        ncesSchoolId: 'school-1',
        hasAcceptedEducationalUseTerms: true,
        hasAcceptedTermsAndConditions: true,
      });
    });
  });

  it('sends manually added school when country usa and a state are selected', async () => {
    const fakeClient = new FakeBoclipsClient();
    const createClassroomUserSpy = jest.spyOn(
      fakeClient.users,
      'createClassroomUser',
    );
    fakeClient.schools.setUsaSchools({
      AR: [
        {
          externalId: 'school-1',
          name: 'Lincoln High School',
          city: 'Little Rock',
        },
        {
          externalId: 'school-2',
          name: 'Harris Elementary School',
          city: 'Hot Springs',
        },
      ],
    });

    const wrapper = renderRegistrationForm(fakeClient);

    await fillTheForm(
      wrapper,
      {
        country: 'United States of America',
        state: 'Arkansas',
        schoolName: 'Laker Institute, Anytown',
      },
      SchoolMode.CUSTOM_VALUE,
    );

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    await waitFor(() => {
      expect(createClassroomUserSpy).toBeCalledWith({
        firstName: 'LeBron',
        lastName: 'James',
        email: 'lj@nba.com',
        password: 'p@ss1234',
        recaptchaToken: 'token_baby',
        type: UserType.classroomUser,
        schoolName: 'Laker Institute, Anytown',
        country: 'USA',
        state: 'AR',
        hasAcceptedEducationalUseTerms: true,
        hasAcceptedTermsAndConditions: true,
      });
    });
  });

  it('error notification is displayed when classroom user creation fails, inputs are not cleared', async () => {
    const fakeClient = new FakeBoclipsClient();
    jest
      .spyOn(fakeClient.users, 'createClassroomUser')
      .mockImplementation(() => Promise.reject());

    const wrapper = render(
      <Router>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsClientProvider client={fakeClient}>
            <ToastContainer />
            <GoogleReCaptchaProvider reCaptchaKey="123">
              <ClassroomRegistrationForm onRegistrationFinished={jest.fn()} />
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
    const fakeClient = new FakeBoclipsClient();
    jest.spyOn(fakeClient.users, 'createClassroomUser').mockImplementation(() =>
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
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <ToastContainer />
            <GoogleReCaptchaProvider reCaptchaKey="123">
              <ClassroomRegistrationForm onRegistrationFinished={jest.fn()} />
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
    const wrapper = renderRegistrationForm(new FakeBoclipsClient());

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
              <ClassroomRegistrationForm
                onRegistrationFinished={registrationFormSpy}
              />
            </GoogleReCaptchaProvider>
          </BoclipsClientProvider>
        </QueryClientProvider>
      </Router>,
    );
  }
});
