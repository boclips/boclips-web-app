import './mockRecaptcha';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { ToastContainer } from 'react-toastify';
import { ClassroomRegistrationData } from 'src/components/classroom/registration/registrationForm/ClassroomRegistrationForm';
import React from 'react';
import { fillRegistrationForm } from 'src/components/classroom/registration/classroomRegistrationFormTestHelpers';
import { ClassroomRegistration } from 'src/components/classroom/registration/ClassroomRegistration';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AccountType } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('registration process', () => {
  async function fillTheForm(
    wrapper: RenderResult,
    change?: Partial<ClassroomRegistrationData>,
  ) {
    const defaults: ClassroomRegistrationData = {
      firstName: 'LeBron',
      lastName: 'James',
      email: 'lj@nba.com',
      password: 'p@ss1234',
      confirmPassword: 'p@ss1234',
      schoolName: 'Los Angeles Lakers',
      country: 'Poland',
      hasAcceptedEducationalUseTerms: true,
      hasAcceptedTermsAndConditions: true,
    };

    await fillRegistrationForm(wrapper, { ...defaults, ...change });
  }

  it('displays "check your email" view after successful registration', async () => {
    const fakeClient = new FakeBoclipsClient();
    jest.spyOn(fakeClient.users, 'createClassroomUser').mockImplementation(() =>
      Promise.resolve(
        UserFactory.sample({
          email: 'test@boclips.com',
          account: {
            ...UserFactory.sample().account,
            name: 'BoAccount',
            id: '1',
            type: AccountType.STANDARD,
          },
        }),
      ),
    );
    const history = createBrowserHistory();

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <Router location={history.location} navigator={history}>
            <ToastContainer />
            <GoogleReCaptchaProvider reCaptchaKey="123">
              <ClassroomRegistration />
            </GoogleReCaptchaProvider>
          </Router>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    await fillTheForm(wrapper, {});

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(await wrapper.findByText('Check your email!')).toBeVisible();

    expect(
      wrapper.getByText(
        'Congratulations! You’ve successfully created your CLASSROOM account.',
      ),
    ).toBeVisible();
    expect(wrapper.getByText('test@boclips.com.')).toBeVisible();
  });
});
