export interface Bucket {
  init: (key: string, options?: any) => void;
  reset: () => void;
  user: (
    userId: string,
    attributes?:
      | {
          [key: string]: any;
          name?: string | undefined;
        }
      | undefined,
  ) => Promise<Response>;
  company: (
    companyId: string,
    attributes?:
      | {
          [key: string]: any;
          name?: string | undefined;
        }
      | null
      | undefined,
    userId?: string | undefined,
  ) => Promise<Response>;
  track: (
    eventName: string,
    attributes?:
      | {
          [key: string]: any;
        }
      | null
      | undefined,
    userId?: string | undefined,
  ) => Promise<Response>;
}
