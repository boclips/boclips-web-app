import { Typography } from '@boclips-ui/typography';
import s from 'src/components/videoPage/videoPage.module.less';
import { FeatureGate } from 'src/components/common/FeatureGate';
import React from 'react';
import { useGetVideoRecommendations } from 'src/hooks/api/videoQuery';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import VideoGridCard from 'src/components/common/gridCard/VideoGridCard';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';

interface Props {
  video: Video;
}

const VideoRecommendations = ({ video }: Props) => {
  const { data: recommendedVideos } = useGetVideoRecommendations(video);

  return (
    <FeatureGate feature="BO_WEB_APP_VIDEO_RECOMMENDATIONS">
      <Typography.H3
        size="xs"
        weight="medium"
        data-qa="video-recommendations"
        className={s.recommendedVideosSectionTitle}
      >
        Explore similar videos
      </Typography.H3>
      <div className={s.recommendedVideosSection}>
        {recommendedVideos &&
          recommendedVideos?.map((recommendedVideo) => (
            <VideoGridCard
              video={recommendedVideo}
              addToCartAppCuesEvent={
                AppcuesEvent.ADD_TO_CART_FROM_RECOMMENDED_VIDEOS
              }
            />
          ))}
      </div>
    </FeatureGate>
  );
};

export default VideoRecommendations;
