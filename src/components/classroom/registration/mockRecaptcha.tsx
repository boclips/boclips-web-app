import React from 'react';

const mockExecuteRecaptcha = vi.fn((_?: string) =>
  Promise.resolve('token_baby'),
);

vi.mock('react-google-recaptcha-v3', () => {
  return {
    GoogleReCaptchaProvider: ({ children }: any): React.JSX.Element => {
      return <>{children}</>;
    },
    useGoogleReCaptcha: () => ({
      executeRecaptcha: mockExecuteRecaptcha,
    }),
  };
});
