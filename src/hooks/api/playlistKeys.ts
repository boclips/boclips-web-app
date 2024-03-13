const all = ['playlists'] as const;

export const playlistKeys = {
  shared: (page: number, query?: string) => {
    if (query) return [...all, 'shared', page, query] as const;
    return [...all, 'shared', page] as const;
  },
  boclips: (page: number, query?: string) => {
    if (query) return [...all, 'boclips', page, query] as const;
    return [...all, 'boclips', page] as const;
  },
  own: (page: number, query?: string) => {
    if (query) return [...all, 'own', page, query] as const;
    return [...all, 'own', page] as const;
  },
  ownAndEditable: [...all, 'ownAndEditable'] as const,
  detail: (id: string) => [...all, id] as const,
};
