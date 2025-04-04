import '../common/mockRecaptcha';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { ToastContainer } from 'react-toastify';
import { DistrictRegistrationData } from 'src/components/classroom/registration/district/registrationForm/DistrictRegistrationForm';
import React from 'react';
import { fillRegistrationForm } from 'src/components/classroom/registration/district/registrationForm/districtRegistrationFormTestHelpers';
import { DistrictRegistration } from 'src/components/classroom/registration/district/DistrictRegistration';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AccountType } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('registration process', () => {
  const fakeClient = new FakeBoclipsClient();

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
      districtName: 'Los Angeles Lakers, Little Rock',
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

  beforeEach(() => {
    fakeClient.districts.setUsaDistricts({
      CA: [
        {
          externalId: 'district-1',
          name: 'Los Angeles Lakers',
          city: 'Little Rock',
        },
      ],
    });
  });

  it('displays "check your email" view after successful registration when email validation required', async () => {
    window.Environment = {
      REGISTRATION_CLASSROOM_REQUIRE_EMAIL_VERIFICATION: 'true',
    };

    jest.spyOn(fakeClient.users, 'createDistrictUser').mockImplementation(() =>
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
              <DistrictRegistration />
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

  it('displays "ready to start" view after successful registration when email validation not required', async () => {
    window.Environment = {
      REGISTRATION_CLASSROOM_REQUIRE_EMAIL_VERIFICATION: 'false',
    };

    jest.spyOn(fakeClient.users, 'createDistrictUser').mockImplementation(() =>
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
              <DistrictRegistration />
            </GoogleReCaptchaProvider>
          </Router>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    await fillTheForm(wrapper, {});

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(await wrapper.findByText(`You're ready to start!`)).toBeVisible();

    expect(
      wrapper.getByText(
        'Congratulations! You’ve successfully created your CLASSROOM account.',
      ),
    ).toBeVisible();
    expect(wrapper.queryByText('test@boclips.com.')).toBeNull();
  });
});
