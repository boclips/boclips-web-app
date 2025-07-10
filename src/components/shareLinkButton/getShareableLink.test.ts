import {
  getShareablePlaylistLink,
  getShareableVideoLink,
} from './getShareableLink';

describe('getShareableVideoLink', () => {
  it('creates a link with referer and share indicator', () => {
    const link = getShareableVideoLink('123', 'user-1');

    const parsedUrl = new URL(link);
    expect(parsedUrl.href).toContain('videos/shared/123');
    expect(parsedUrl.searchParams.get('referer')).toEqual('user-1');
    expect(parsedUrl.searchParams.get('segmentStart')).toBeNull();
    expect(parsedUrl.searchParams.get('segmentEnd')).toBeNull();
  });

  it('adds segment bounds when segment is not null', () => {
    const link = getShareableVideoLink('123', 'dave', 10, 20);

    const parsedUrl = new URL(link);
    expect(parsedUrl.searchParams.get('segmentStart')).toEqual('10');
    expect(parsedUrl.searchParams.get('segmentEnd')).toEqual('20');
  });

  it('adds segment bounds when segment start is null', () => {
    const link = getShareableVideoLink('123', 'dave', null, 20);

    const parsedUrl = new URL(link);
    expect(parsedUrl.searchParams.get('segmentStart')).toBeNull();
    expect(parsedUrl.searchParams.get('segmentEnd')).toEqual('20');
  });

  it('adds segment bounds when segment end is null', () => {
    const link = getShareableVideoLink('123', 'dave', 10, null);

    const parsedUrl = new URL(link);
    expect(parsedUrl.searchParams.get('segmentStart')).toEqual('10');
    expect(parsedUrl.searchParams.get('segmentEnd')).toBeNull();
  });
});

describe('getShareablePlaylistLink', () => {
  it('creates a link with referer and share indicator', () => {
    const link = getShareablePlaylistLink('123', 'user-1');

    const parsedUrl = new URL(link);
    expect(parsedUrl.href).toContain('playlists/shared/123');
    expect(parsedUrl.searchParams.get('referer')).toEqual('user-1');
  });
});
