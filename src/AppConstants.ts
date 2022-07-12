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

  public get AUTH_ENDPOINT(): string {
    return this.window.Environment.AUTH_ENDPOINT;
  }

  public get IS_HOTJAR_ENABLED(): boolean {
    return this.window.Environment.IS_HOTJAR_ENABLED === 'true';
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

  public get MIXPANEL_TOKEN(): string | null {
    return this.window.Environment.MIXPANEL_TOKEN ?? null;
  }

  public get BUCKET_TOKEN(): string | null {
    return this.window.Environment.BUCKET_TOKEN ?? null;
  }

  public get PEARSON_ORGANISATION_ID(): string {
    return this.window.Environment.PEARSON_ORGANISATION_ID;
  }

  public get HOST(): string {
    return `${this.window.location.protocol}//${this.window.location.hostname}${
      this.window.location.port ? `:${this.window.location.port}` : ''
    }`;
  }
}

export const Constants = new AppConstants(window);
