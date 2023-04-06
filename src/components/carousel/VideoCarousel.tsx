import { Link } from 'react-router-dom';
import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { useGetVideos } from 'src/hooks/api/videoQuery';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import ChevronSVG from 'src/resources/icons/chevron.svg';

interface Props {
  videoIds: string[];
  title: string;
}

export const VideoCarousel = ({ videoIds, title }: Props) => {
  const { data: videos, isLoading } = useGetVideos(videoIds);

  return (
    !isLoading &&
    videos.length > 0 && (
      <div>
        <Typography.H3 className="mb-4">{title}</Typography.H3>
        <CarouselProvider
          className="my-6"
          totalSlides={videos?.length}
          naturalSlideWidth={10}
          naturalSlideHeight={20}
          visibleSlides={4}
        >
          <div className="relative px-4">
            <Slider className="h-56 m-auto">
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
                    <div className="bg-white rounded-2xl shadow-lg p-4 mb-10 w-full">
                      <VideoPlayer video={video} />
                      <Typography.H4>{video.title}</Typography.H4>
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
