import { Typography } from 'boclips-ui';
import s from '@components/videoPage/videoPage.module.less';
import React from 'react';
import { useGetVideoRecommendations } from '@src/hooks/api/videoQuery';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import AnalyticsFactory from '@src/services/analytics/AnalyticsFactory';
import VideoGridCard from '@components/videoCard/VideoGridCard';
import { useSearchQueryLocationParams } from '@src/hooks/useLocationParams';
import { FilterKey } from '@src/types/search/FilterKey';
import { HotjarEvents } from '@src/services/analytics/hotjar/Events';
import { VideoCardButtons } from '../videoCard/buttons/VideoCardButtons';

interface Props {
  video: Video;
}

const VideoRecommendations = ({ video }: Props) => {
  const { data: recommendedVideos } = useGetVideoRecommendations(video);
  const [searchLocation, setSearchLocation] = useSearchQueryLocationParams();
  const { filters: filtersFromURL } = searchLocation;
  const trackAddToCart = () => {
    AnalyticsFactory.hotjar().event(
      HotjarEvents.AddToCartFromRecommendedVideos,
    );
  };

  const handleFilterChange = (key: FilterKey, values: string[]) => {
    const newFilters = { ...filtersFromURL, [key]: values };

    setSearchLocation({
      pathName: '/videos',
      query: '',
      page: 1,
      filters: newFilters,
    });
  };

  return recommendedVideos && recommendedVideos.length ? (
    <section
      aria-labelledby="explore-similar-videos"
      className={s.recommendedVideosSection}
    >
      <Typography.H1
        size="xs"
        weight="medium"
        data-qa="video-recommendations"
        className={s.recommendedVideosSectionTitle}
        id="explore-similar-videos"
      >
        Explore similar videos
      </Typography.H1>
      <div className={s.recommendedVideosGrid}>
        {recommendedVideos?.map((recommendedVideo) => (
          <VideoGridCard
            key={recommendedVideo.id}
            video={recommendedVideo}
            handleFilterChange={handleFilterChange}
            buttonsRow={
              <VideoCardButtons
                video={recommendedVideo}
                onAddToCart={trackAddToCart}
                iconOnly
              />
            }
          />
        ))}
      </div>
    </section>
  ) : null;
};

export default VideoRecommendations;
