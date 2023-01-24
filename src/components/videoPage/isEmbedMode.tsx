export const isEmbedMode = (originPathname?: string) =>
  originPathname?.startsWith('/explore');
