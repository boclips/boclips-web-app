export const stubBoclipsSecurity = {
  logout: vi.fn(),
  isAuthenticated: () => true,
  getTokenFactory: vi.fn(),
  configureAxios: vi.fn(),
  ssoLogin: vi.fn(),
  hasRole: (_role: string) => true,
};
