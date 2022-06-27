import { Typography } from '@boclips-ui/typography';
import s from 'src/components/videoPage/videoPage.module.less';
import React from 'react';
import { useGetVideoRecommendations } from 'src/hooks/api/videoQuery';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import VideoGridCard from 'src/components/common/gridCard/VideoGridCard';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';

interface Props {
  video: Video;
}

const VideoRecommendations = ({ video }: Props) => {
  const { data: recommendedVideos } = useGetVideoRecommendations(video);
  const mixpanel = AnalyticsFactory.mixpanel();
  const trackAddToCart = () => {
    AnalyticsFactory.appcues().sendEvent(
      AppcuesEvent.ADD_TO_CART_FROM_RECOMMENDED_VIDEOS,
    );
    mixpanel.track('video_recommendation_cart_add');
  };

  return recommendedVideos && recommendedVideos.length ? (
    <>
      <Typography.H3
        size="xs"
        weight="medium"
        data-qa="video-recommendations"
        className={s.recommendedVideosSectionTitle}
      >
        Explore similar videos
      </Typography.H3>
      <div className={s.recommendedVideosSection}>
        {recommendedVideos?.map((recommendedVideo) => (
          <VideoGridCard
            video={recommendedVideo}
            onAddToCart={trackAddToCart}
            onSegmentPlayed={(start: number, end: number) => {
              mixpanel.track('video_recommendation_played', {
                start,
                end,
                videoId: recommendedVideo.id,
              });
            }}
          />
        ))}
      </div>
    </>
  ) : null;
};

export default VideoRecommendations;
