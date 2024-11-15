import './mockRecaptcha';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from '@src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { Registration } from '@src/components/registration/Registration';
import {
  resizeToDesktop,
  resizeToMobile,
  resizeToTablet,
} from '@src/testSupport/resizeTo';
import { BrowserRouter as Router } from 'react-router-dom';

describe('registration', () => {
  it('displays trial info box in desktop view', async () => {
    resizeToDesktop();
    const wrapper = renderRegistration();

    expect(await wrapper.findByText('Explore Boclips Library!')).toBeVisible();
  });

  it('does not displays trial info box in mobile view', async () => {
    resizeToMobile();
    const wrapper = renderRegistration();

    expect(wrapper.queryByText('Explore Boclips Library!')).toBeNull();
  });

  it('does not displays trial info box in tablet view', async () => {
    resizeToTablet();
    const wrapper = renderRegistration();

    expect(wrapper.queryByText('Explore Boclips Library!')).toBeNull();
  });

  const renderRegistration = () => {
    return render(
      <Router>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <GoogleReCaptchaProvider reCaptchaKey="123">
              <Registration />
            </GoogleReCaptchaProvider>
          </BoclipsClientProvider>
        </QueryClientProvider>
      </Router>,
    );
  };
});
