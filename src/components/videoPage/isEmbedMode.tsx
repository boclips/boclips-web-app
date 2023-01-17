export const isEmbedMode = (originPathname?: string) =>
  originPathname?.startsWith('/sparks');
