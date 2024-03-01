import './mockRecaptcha';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { ClassroomRegistration } from 'src/components/classroom/registration/ClassroomRegistration';
import {
  resizeToDesktop,
  resizeToMobile,
  resizeToTablet,
} from 'src/testSupport/resizeTo';
import { BrowserRouter as Router } from 'react-router-dom';

describe('registration', () => {
  it('displays classroom info box in desktop view', async () => {
    resizeToDesktop();
    renderRegistration();

    expect(
      await screen.findByText('Welcome to Boclips Classroom!'),
    ).toBeVisible();
  });

  it('does not displays classroom info box in mobile view', async () => {
    resizeToMobile();
    renderRegistration();

    expect(screen.queryByText('Welcome to Boclips Classroom!')).toBeNull();
  });

  it('does not displays classroom info box in tablet view', async () => {
    resizeToTablet();
    renderRegistration();

    expect(screen.queryByText('Welcome to Boclips Classroom!')).toBeNull();
  });

  const renderRegistration = () => {
    return render(
      <Router>
        <QueryClientProvider client={new QueryClient()}>
          <BoclipsClientProvider client={new FakeBoclipsClient()}>
            <GoogleReCaptchaProvider reCaptchaKey="123">
              <ClassroomRegistration />
            </GoogleReCaptchaProvider>
          </BoclipsClientProvider>
        </QueryClientProvider>
      </Router>,
    );
  };
});
