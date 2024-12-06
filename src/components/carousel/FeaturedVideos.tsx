import React, { useMemo } from 'react';
import { useGetVideos } from '@src/hooks/api/videoQuery';
import { Carousel } from '@components/common/carousel/Carousel';
import VideoSlide from '@components/carousel/VideoSlide';
import s from './styles.module.less';

const featuredLibraryVideoIds = [
  // production:
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
  // staging:
  '5cf15907ce7c2c4e21274630',
  '5c7d01dec4347d45194e0666',
  '5c7d00f2c4347d45194e057d',
  '5e1b60cb9c8e9c13875c2d6c',
  '5c7d05e3c4347d45194e0ac0',
];

const featuredClassroomVideoIds = [
  // production:
  '642963c7f2ff6f79b7a3deee',
  '65e219d3acb34d232a464c4f',
  '62555fbb357dff6f7b1259bd',
  '65153855ec623442504c7fa2',
  '5c54d6d5d8eafeecae206c43',
  '63c049bffedee80107512616',
  '64e60019f7750101fe519fe3',
  '63bea57e920da25f8bd866c6',
  '5e15d46fcdc1f47e7c0b62a5',
  '5c54d67cd8eafeecae20408c',
  // staging:
  '5cf15907ce7c2c4e21274630',
  '5c7d01dec4347d45194e0666',
  '5e1b60cb9c8e9c13875c2d6c',
  '5c7d00f2c4347d45194e057d',
  '5c7d05e3c4347d45194e0ac0',
];

interface Props {
  product: 'CLASSROOM' | 'LIBRARY';
}

const FeaturedVideos = ({ product }: Props) => {
  let videoIds: string[];
  switch (product) {
    case 'CLASSROOM':
      videoIds = featuredClassroomVideoIds;
      break;
    case 'LIBRARY':
    default:
      videoIds = featuredLibraryVideoIds;
      break;
  }

  const { data: videos, isLoading } = useGetVideos(videoIds);

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
