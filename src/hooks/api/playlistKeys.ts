const all = ['playlists'] as const;

export const playlistKeys = {
  ownAndShared: [...all, 'ownAndShared'] as const,
  own: [...all, 'own'] as const,
  detail: (id: string) => [...all, id] as const,
};
