import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Link } from 'react-router-dom';
import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { useGetVideos } from 'src/hooks/api/videoQuery';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoPlayer } from 'src/components/videoCard/VideoPlayer';

export const VideoCarousel = ({ videoIds, title }) => {
  const { data: videos, isLoading } = useGetVideos(videoIds);

  return (
    <div>
      <Typography.H3 className="mb-4">{title}</Typography.H3>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        spaceBetween={30}
        loop
        pagination
        speed={2000}
        preventClicks={false}
        slidesPerView={4}
      >
        {!isLoading &&
          videos.map((video: Video) => (
            <SwiperSlide>
              <Link
                to={{
                  pathname: `/videos/${video.id}`,
                }}
                state={{
                  userNavigated: true,
                }}
                aria-label={`${video.title} grid card`}
              >
                <div className="bg-white rounded-lg shadow-lg p-4 mb-10 w-full">
                  <VideoPlayer video={video} />
                  <Typography.H4>{video.title}</Typography.H4>
                </div>
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};
