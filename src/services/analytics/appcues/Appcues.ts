export default interface Appcues {
  identify: (userId: string, user: any) => Record<string, never>;
  page: () => Record<string, never>;
  track: (event: string, payload?: any) => Record<string, never>;
}
