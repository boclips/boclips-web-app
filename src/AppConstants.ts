declare global {
  interface Window {
    Environment: any;
  }
}

window.Environment = window.Environment || {};

export class AppConstants {
  public CLASSROOM_TERMS_AND_CONDITIONS_LINK =
    'https://www.boclips.com/mlsa-classroom';

  public LIBRARY_TERMS_AND_CONDITIONS_LINK = 'https://www.boclips.com/mlsa';

  private window: Window;

  public constructor(window: Window) {
    this.window = window;
  }

  public get AUTH_ENDPOINT(): string {
    return this.window.Environment.AUTH_ENDPOINT;
  }

  public get IS_HOTJAR_ENABLED(): boolean {
    return this.window.Environment.IS_HOTJAR_ENABLED === 'true';
  }

  public get CLASSROOM_ONBOARDING_VIDEO_ID(): string {
    return this.window.Environment.CLASSROOM_ONBOARDING_VIDEO_ID;
  }

  public get IS_PENDO_ENABLED(): boolean {
    return this.window.Environment.IS_PENDO_ENABLED === 'true';
  }

  public get IS_SENTRY_ENABLED(): boolean {
    return this.window.Environment.IS_SENTRY_ENABLED === 'true';
  }

  public get IS_HUBSPOT_ENABLED(): boolean {
    return this.window.Environment.IS_HUBSPOT_ENABLED === 'true';
  }

  public get API_PREFIX(): string {
    return this.window.Environment.API_PREFIX;
  }

  public get CHAT_URL(): string {
    return this.window.Environment.CHAT_URL;
  }

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
}

export const Constants = new AppConstants(window);
