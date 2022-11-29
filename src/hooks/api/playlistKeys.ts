const all = ['playlists'] as const;

export const playlistKeys = {
  ownAndShared: (page: number, query?: string) => {
    if (query) return [...all, 'ownAndShared', page, query] as const;
    return [...all, 'ownAndShared', page] as const;
  },
  own: [...all, 'own'] as const,
  detail: (id: string) => [...all, id] as const,
};
