import { Link } from 'react-router-dom';
import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import ChevronSVG from 'src/resources/icons/chevron.svg';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';

interface Props {
  videos: Video[];
  title: string;
}

export const VideoCarousel = ({ videos, title }: Props) => {
  return (
    videos.length > 0 && (
      <div className="px-4 py-6 rounded">
        <Typography.H3 className="mb-4 px-7">{title}</Typography.H3>
        <CarouselProvider
          totalSlides={videos?.length}
          naturalSlideWidth={10}
          naturalSlideHeight={20}
          visibleSlides={4}
        >
          <div className="relative px-4">
            <Slider className="h-64 m-auto">
              {videos.map((video: Video, key: number) => (
                <Slide index={key}>
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
                </Slide>
              ))}
            </Slider>
            <ButtonBack className="absolute top-1/2 left-0">
              <ChevronSVG />
            </ButtonBack>
            <ButtonNext className="absolute top-1/2 right-0 transform rotate-180">
              <ChevronSVG />
            </ButtonNext>
          </div>
        </CarouselProvider>
      </div>
    )
  );
};
