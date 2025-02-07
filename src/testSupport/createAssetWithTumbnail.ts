import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { Link } from 'boclips-api-client/dist/types';
import { CollectionAssetFactory } from 'boclips-api-client/dist/test-support';

export const createAssetWithThumbnail = (id: string, videoTitle: string) => {
  const video = VideoFactory.sample({
    id,
    title: `${videoTitle} ${id}`,
    playback: PlaybackFactory.sample({
      links: {
        thumbnail: new Link({ href: 'http://thumbnail.jpg' }),
        createPlayerInteractedWithEvent: new Link({ href: 'todo' }),
      },
    }),
  });
  return CollectionAssetFactory.sample({
    id: { videoId: id, highlightId: null },
    video,
  });
};
