import '../mockRecaptcha';
import { render, RenderResult, waitFor } from '@testing-library/react';
import React from 'react';
import ClassroomRegistrationForm, {
  ClassroomRegistrationData,
} from '@components/classroom/registration/registrationForm/ClassroomRegistrationForm';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import {
  fillRegistrationForm,
  SchoolMode,
  setDropdownValue,
} from '@components/classroom/registration/registrationForm/classroomRegistrationFormTestHelpers';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('ClassroomRegistration Form Validation', () => {
  const fakeClient = new FakeBoclipsClient();
  const createClassroomUserSpy = vi.spyOn(
    fakeClient.users,
    'createClassroomUser',
  );

  it('first name cannot be empty', async () => {
    const wrapper = renderRegistrationForm();

    await fillTheForm(wrapper, { firstName: '' });

    await checkErrorIsNotVisible(wrapper, 'First name is required');
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );
    await checkErrorIsVisible(wrapper, 'First name is required');

    await waitFor(() => {
      expect(createClassroomUserSpy).not.toBeCalled();
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
      expect(createClassroomUserSpy).not.toBeCalled();
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
        expect(createClassroomUserSpy).not.toBeCalled();
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
        expect(createClassroomUserSpy).not.toBeCalled();
      });
    });
  });

  describe('school name', () => {
    it('school name cannot be empty', async () => {
      const wrapper = renderRegistrationForm();

      await fillTheForm(wrapper, { schoolName: '' });

      await checkErrorIsNotVisible(wrapper, 'School name is required');
      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );
      await checkErrorIsVisible(wrapper, 'School name is required');

      await waitFor(() => {
        expect(createClassroomUserSpy).not.toBeCalled();
      });
    });

    it('clears error when school name is filled', async () => {
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
      const wrapper = renderRegistrationForm();
      await fillTheForm(
        wrapper,
        {
          country: 'United States of America',
          state: 'Arkansas',
          schoolName: '',
        },
        SchoolMode.DROPDOWN_VALUE,
      );
      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );

      await checkErrorIsVisible(wrapper, 'School name is required');

      await fillTheForm(
        wrapper,
        {
          country: 'United States of America',
          state: 'Arkansas',
          schoolName: 'Lincoln High School, Little Rock',
        },
        SchoolMode.DROPDOWN_VALUE,
      );

      await checkErrorIsNotVisible(wrapper, 'School name is required');

      await waitFor(() => {
        expect(createClassroomUserSpy).not.toBeCalled();
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
        expect(createClassroomUserSpy).not.toBeCalled();
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
        expect(createClassroomUserSpy).not.toBeCalled();
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
        expect(createClassroomUserSpy).not.toBeCalled();
      });
    });
  });

  describe('country and state', () => {
    it('country cannot be empty', async () => {
      const wrapper = renderRegistrationForm();

      await fillTheForm(wrapper, { country: '', schoolName: '' });

      await checkErrorIsNotVisible(wrapper, 'Please select a country');
      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );
      await checkErrorIsVisible(wrapper, 'Please select a country');

      await waitFor(() => {
        expect(createClassroomUserSpy).not.toBeCalled();
      });
    });

    it('clears error when country is filled', async () => {
      const wrapper = renderRegistrationForm();
      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );

      await checkErrorIsVisible(wrapper, 'Please select a country');

      await fillTheForm(wrapper, {
        country: 'India',
        schoolName: '',
      });

      await checkErrorIsNotVisible(wrapper, 'Please select a country');
    });

    it('states cannot be empty when country is USA', async () => {
      const wrapper = renderRegistrationForm();

      await setDropdownValue(
        wrapper,
        'input-dropdown-country',
        'United States of America',
      );
      await checkErrorIsNotVisible(wrapper, 'Please select a state');

      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );
      await checkErrorIsVisible(wrapper, 'Please select a state');

      await waitFor(() => {
        expect(createClassroomUserSpy).not.toBeCalled();
      });
    });

    it('clears states error when filled', async () => {
      const wrapper = renderRegistrationForm();

      await fillTheForm(wrapper, {
        country: 'United States of America',
        state: '',
        schoolName: '',
      });

      await userEvent.click(
        wrapper.getByRole('button', { name: 'Create Account' }),
      );
      await checkErrorIsVisible(wrapper, 'Please select a state');

      await fillTheForm(wrapper, {
        country: 'United States of America',
        state: 'Florida',
        schoolName: '',
      });

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

    expect(createClassroomUserSpy).not.toBeCalled();
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

    expect(createClassroomUserSpy).not.toBeCalled();
  });

  it('displays error message if email already exists', async () => {
    jest
      .spyOn(fakeClient.users, 'createClassroomUser')
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
      .spyOn(fakeClient.users, 'createClassroomUser')
      .mockImplementation(() =>
        Promise.reject(new Error('Account Boclips already exists')),
      );

    const wrapper = renderRegistrationForm();
    await fillTheForm(wrapper, { schoolName: 'Boclips' });

    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    expect(
      await wrapper.findByText(
        'Cannot use this school name. Try another or contact us.',
      ),
    ).toBeVisible();
  });

  it('errors disappear when form is fixed', async () => {
    const wrapper = renderRegistrationForm();

    await fillTheForm(wrapper, {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      schoolName: '',
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

    await fillTheForm(wrapper, {});
    await userEvent.click(
      wrapper.getByRole('button', { name: 'Create Account' }),
    );

    await checkErrorIsNotVisible(wrapper, 'First name is required');
    await checkErrorIsNotVisible(wrapper, 'Last name is required');
    await checkErrorIsNotVisible(wrapper, 'Email is required');
    await checkErrorIsNotVisible(wrapper, 'School name is required');
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
      expect(createClassroomUserSpy).toBeCalled();
    });
  });

  function renderRegistrationForm(): RenderResult {
    return render(
      <Router>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsClientProvider client={fakeClient}>
            <GoogleReCaptchaProvider reCaptchaKey="123">
              <ClassroomRegistrationForm onRegistrationFinished={vi.fn()} />
            </GoogleReCaptchaProvider>
          </BoclipsClientProvider>
        </QueryClientProvider>
      </Router>,
    );
  }

  async function fillTheForm(
    wrapper: RenderResult,
    change?: Partial<ClassroomRegistrationData>,
    schoolMode: SchoolMode = SchoolMode.FREE_TEXT,
  ) {
    const defaults: ClassroomRegistrationData = {
      firstName: 'Lebron',
      lastName: 'James',
      email: 'lj@nba.com',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssw0rd',
      schoolName: 'Los Angeles Lakers',
      country: 'Poland',
      state: '',
      hasAcceptedEducationalUseTerms: true,
      hasAcceptedTermsAndConditions: true,
    };

    await fillRegistrationForm(wrapper, { ...defaults, ...change }, schoolMode);
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
