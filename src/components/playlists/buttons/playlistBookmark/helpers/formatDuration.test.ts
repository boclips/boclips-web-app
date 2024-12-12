import formatDuration from '@src/components/playlists/buttons/playlistBookmark/helpers/formatDuration';

describe('formatDuration', () => {
  it('correctly formats seconds under one minute', () => {
    expect(formatDuration(45)).toBe('00:45');
  });

  it('correctly formats 60 seconds as one minute', () => {
    expect(formatDuration(60)).toBe('01:00');
  });

  it('correctly formats seconds over one minute', () => {
    expect(formatDuration(125)).toBe('02:05');
  });

  it('correctly formats seconds when minutes and seconds are less than 10', () => {
    expect(formatDuration(305)).toBe('05:05');
  });

  it('handles zero seconds', () => {
    expect(formatDuration(0)).toBe('00:00');
  });

  it('handles more than an hour', () => {
    expect(formatDuration(3665)).toBe('61:05');
  });
});
