declare global {
  interface Window {
    Environment: any;
  }
}

window.Environment = window.Environment || {};

export class AppConstants {
  private window: Window;

  public constructor(window: Window) {
    this.window = window;
  }

  AUTH_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT;

  IS_HOTJAR_ENABLED = import.meta.env.VITE_IS_HOTJAR_ENABLED === 'true';

  CLASSROOM_ONBOARDING_VIDEO_ID = import.meta.env
    .VITE_CLASSROOM_ONBOARDING_VIDEO_ID;

  IS_PENDO_ENABLED = import.meta.env.VITE_IS_PENDO_ENABLED === 'true';

  IS_SENTRY_ENABLED = import.meta.env.VITE_IS_SENTRY_ENABLED === 'true';

  IS_HUBSPOT_ENABLED = import.meta.env.VITE_IS_HUBSPOT_ENABLED === 'true';

  API_PREFIX = import.meta.env.VITE_API_PREFIX;

  public get PEARSON_ACCOUNT_ID(): string {
    return this.window.Environment.PEARSON_ACCOUNT_ID;
  }

  public get REGISTRATION_CLASSROOM_REQUIRE_EMAIL_VERIFICATION(): boolean {
    return (
      this.window.Environment
        .REGISTRATION_CLASSROOM_REQUIRE_EMAIL_VERIFICATION === 'true'
    );
  }

  public get HOST(): string {
    return `${this.window.location.protocol}//${this.window.location.hostname}${
      this.window.location.port ? `:${this.window.location.port}` : ''
    }`;
  }

  public get CAPTCHA_TOKEN(): string {
    return this.window.Environment.CAPTCHA_TOKEN ?? null;
  }

  public CLASSROOM_TERMS_AND_CONDITIONS_LINK =
    'https://www.boclips.com/mlsa-classroom';

  public LIBRARY_TERMS_AND_CONDITIONS_LINK = 'https://www.boclips.com/mlsa';
}

export const Constants = new AppConstants(window);
