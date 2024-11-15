import { Video } from 'boclips-api-client/dist/types';
import VideoGridCard from '@src/components/videoCard/VideoGridCard';
import React from 'react';
import { useSearchQueryLocationParams } from '@src/hooks/useLocationParams';
import { FilterKey } from '@src/types/search/FilterKey';
import s from './VideoGridCardContainer.module.less';
import { AlignmentVideoCardButtons } from './AlignmentVideoCardButtons';

interface Props {
  videos: Video[];
}

export const VideoGridCardContainer = ({ videos }: Props) => {
  const [searchLocation, setSearchLocation] = useSearchQueryLocationParams();
  const { filters: filtersFromURL } = searchLocation;

  const handleFilterChange = (key: FilterKey, values: string[]) => {
    const newFilters = { ...filtersFromURL, [key]: values };

    setSearchLocation({
      pathName: '/videos',
      query: '',
      page: 1,
      filters: newFilters,
    });
  };

  return (
    <div className={s.container}>
      {videos.map((video) => (
        <VideoGridCard
          key={video.id}
          video={video}
          handleFilterChange={handleFilterChange}
          buttonsRow={<AlignmentVideoCardButtons video={video} />}
        />
      ))}
    </div>
  );
};
