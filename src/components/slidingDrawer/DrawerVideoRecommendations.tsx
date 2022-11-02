import React from 'react';
import { Typography } from '@boclips-ui/typography';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';

interface Props {
  videosAddedThusFar: Video[];
  // onVideoAdded: (video: Video) => void;
}

const DrawerVideoRecommendations = ({ videosAddedThusFar }: Props) => {
  return (
    <>
      {videosAddedThusFar.length > 0 && (
        <div>
          <Typography.H1 size="xs">Recommended videos</Typography.H1>
          {videosAddedThusFar.map((it) => (
            <section>{it.title}</section>
          ))}
        </div>
      )}
    </>
  );
};

export default DrawerVideoRecommendations;
