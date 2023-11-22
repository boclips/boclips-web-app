import './mockRecaptcha';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { ToastContainer } from 'react-toastify';
import { RegistrationData } from 'src/components/registration/RegistrationForm';
import React from 'react';
import { fillRegistrationForm } from 'src/components/registration/registrationFormTestHelpers';
import { RegistrationProcess } from 'src/components/registration/RegistrationProcess';

describe('registration process', () => {
  async function fillTheForm(
    wrapper: RenderResult,
    change?: Partial<RegistrationData>,
  ) {
    const defaults: RegistrationData = {
      firstName: 'LeBron',
      lastName: 'James',
      email: 'lj@nba.com',
      password: 'p@ss1234',
      confirmPassword: 'p@ss1234',
      accountName: 'Los Angeles Lakers',
      jobTitle: 'Teacher',
      country: 'Poland',
      typeOfOrg: 'EdTech',
      audience: 'K12',
      discoveryMethod: 'Teacher',
      desiredContent: 'Maths',
      hasAcceptedEducationalUseTerms: true,
    };

    await fillRegistrationForm(wrapper, { ...defaults, ...change });
  }

  it('displays "verify your email" view after successful registration', async () => {
    const fakeClient = new FakeBoclipsClient();
    jest.spyOn(fakeClient.users, 'createTrialUser').mockImplementation(() =>
      Promise.resolve(
        UserFactory.sample({
          email: 'test@boclips.com',
          account: { name: 'BoAccount', id: '1' },
        }),
      ),
    );

    const wrapper = render(
      <QueryClientProvider client={new QueryClient()}>
        <BoclipsClientProvider client={fakeClient}>
          <ToastContainer />
          <GoogleReCaptchaProvider reCaptchaKey="123">
            <RegistrationProcess />
          </GoogleReCaptchaProvider>
        </BoclipsClientProvider>
      </QueryClientProvider>,
    );

    await fillTheForm(wrapper, {});

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(await wrapper.findByText('Verify your Email')).toBeVisible();

    expect(
      wrapper.getByText(
        'We have sent an email to test@boclips.com. Check your email inbox now',
      ),
    ).toBeVisible();
    expect(wrapper.getByText(': BoAccount')).toBeVisible();
    expect(wrapper.getByText(': test@boclips.com')).toBeVisible();
  });
});
