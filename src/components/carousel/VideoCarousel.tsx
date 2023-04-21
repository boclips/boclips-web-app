import { Link } from 'react-router-dom';
import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';
import { Carousel } from 'src/components/common/carousel/Carousel';

interface Props {
  videos: Video[];
  title: string;
}

export const VideoCarousel = ({ videos, title }: Props) => {
  const getSlides = () =>
    videos.map((video: Video) => (
      <Link
        to={{
          pathname: `/videos/${video.id}`,
        }}
        state={{
          userNavigated: true,
        }}
        aria-label={`${video.title} grid card`}
      >
        <div className="mx-4 bg-white rounded-lg shadow-lg pb-2">
          <Thumbnail video={video} />
          <div className="m-3">
            <Typography.H4 className="truncate-one-line">
              {video.title}
            </Typography.H4>
          </div>
        </div>
      </Link>
    ));
  return videos.length > 0 && <Carousel slides={getSlides()} title={title} />;
};
