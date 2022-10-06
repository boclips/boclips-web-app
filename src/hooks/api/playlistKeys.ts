const all = ['playlists'] as const;

export const playlistKeys = {
  ownAndShared: (page: number) => [...all, 'ownAndShared', page] as const,
  own: [...all, 'own'] as const,
  detail: (id: string) => [...all, id] as const,
};
