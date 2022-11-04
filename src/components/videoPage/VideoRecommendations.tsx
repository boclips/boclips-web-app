import { Typography } from '@boclips-ui/typography';
import s from 'src/components/videoPage/videoPage.module.less';
import React from 'react';
import { useGetVideoRecommendations } from 'src/hooks/api/videoQuery';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import VideoGridCard from 'src/components/videoCard/VideoGridCard';
import { useSearchQueryLocationParams } from 'src/hooks/useLocationParams';
import { FilterKey } from 'src/types/search/FilterKey';
import { VideoCardButtons } from '../videoCard/buttons/VideoCardButtons';

interface Props {
  video: Video;
}

const VideoRecommendations = ({ video }: Props) => {
  const { data: recommendedVideos } = useGetVideoRecommendations(video);
  const [searchLocation, setSearchLocation] = useSearchQueryLocationParams();
  const { filters: filtersFromURL } = searchLocation;
  const mixpanel = AnalyticsFactory.mixpanel();
  const trackAddToCart = () => {
    AnalyticsFactory.appcues().sendEvent(
      AppcuesEvent.ADD_TO_CART_FROM_RECOMMENDED_VIDEOS,
    );
    mixpanel.track('video_recommendation_cart_add');
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
            onLinkClicked={() => {
              mixpanel.track('video_recommendation_clicked');
            }}
            onSegmentPlayed={(start: number, end: number) => {
              mixpanel.track('video_recommendation_played', {
                start,
                end,
                videoId: recommendedVideo.id,
              });
            }}
            buttonsRow={
              <VideoCardButtons
                video={recommendedVideo}
                onAddToCart={trackAddToCart}
                onAddToPlaylist={() => {
                  mixpanel.track('video_recommendation_playlist_add');
                }}
                onUrlCopied={() => {
                  mixpanel.track('video_recommendation_url_copied');
                }}
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
