import React, { useMemo } from 'react';
import { useGetVideos } from 'src/hooks/api/videoQuery';
import { Carousel } from 'src/components/common/carousel/Carousel';
import VideoSlide from 'src/components/carousel/VideoSlide';
import s from './styles.module.less';

const featuredVideoIds = [
  '63fdfe8ad7fbb13615d23591',
  '60cb11f60560d046cde9d1e9',
  '627b417eef77c448ec160d95',
  '63c04899bf161a652f79f0ed',
  '60e6e62fe7e9341b46812ccf',
  '63e44e914b4639343c219850',
  '63b521d4b82a1438860007c6',
  '63c7510ed1a2560d1c08ae1c',
  '63e393c0f27ad003523df5ea',
  '6408901541a2894ba64e2548',
];

const FeaturedVideos = () => {
  const { data: videos, isLoading } = useGetVideos(featuredVideoIds);

  const getVideoSlides = useMemo(
    () => videos?.map((video) => <VideoSlide key={video.id} video={video} />),
    [videos],
  );

  if (isLoading) {
    return null;
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className={s.carouselWrapper}>
      <Carousel slides={getVideoSlides} title="Featured Videos" />
    </div>
  );
};

export default FeaturedVideos;
