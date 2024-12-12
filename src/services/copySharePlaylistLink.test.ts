import { CollectionFactory } from '@src/testSupport/CollectionFactory';
import { copySharePlaylistLink } from '@src/services/copySharePlaylistLink';
import { Constants } from '@src/AppConstants';

describe('copySharePlaylistLink', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => Promise.resolve(),
    },
  });

  it('copies playlist link top the clipboard', () => {
    vi.spyOn(navigator.clipboard, 'writeText');
    const playlist = CollectionFactory.sample({ id: 'myfavplaylist' });

    copySharePlaylistLink(playlist);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${Constants.HOST}/playlists/myfavplaylist`,
    );
  });
});
