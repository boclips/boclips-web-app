import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import React from 'react';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import { Typography } from '@boclips-ui/typography';
import { VideoInfo } from 'src/components/common/videoInfo/VideoInfo';
import { VideoBadges } from 'src/components/videoPage/VideoBadges';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { DownloadTranscriptButton } from 'src/components/downloadTranscriptButton/DownloadTranscriptButton';
import { PriceBadge } from 'src/components/common/price/PriceBadge';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoLicensingDetails } from 'src/components/videoPage/videoLicensingDetails/VideoLicensingDetails';
import useFeatureFlags from 'src/hooks/useFeatureFlags';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { VideoShareCodeButton } from 'src/components/shareCodeButton/VideoShareCodeButton';
import { EmbedButton } from 'src/components/embedButton/EmbedButton';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { CopyVideoLinkButton } from '../videoCard/buttons/CopyVideoLinkButton';
import s from './style.module.less';

interface Props {
  video?: Video;
}

export const VideoHeader = ({ video }: Props) => {
  const { features, isLoading: featuresAreLoading } = useFeatureFlags();
  const { data: currentUser } = useGetUserQuery();

  const isAuthenticated = !!currentUser;

  const showLicensingDetails =
    !featuresAreLoading &&
    !features?.LICENSE_DURATION_RESTRICTION_CHECKS_DISABLED;

  if (!video) {
    return null;
  }

  const videoHasTranscript = video?.links?.transcript;

  const trackVideoCopy = () => {
    AnalyticsFactory.hotjar().event(HotjarEvents.CopyLinkFromVideoPage);
  };

  return (
    <>
      <div className={s.sticky}>
        <div className="flex justify-between">
          <Typography.H1 size="md" className="text-gray-900 " id="video-title">
            {video?.title}
          </Typography.H1>
          <FeatureGate feature="BO_WEB_APP_PRICES" fallback={null}>
            {video?.price && (
              <span className="border-1 border-primary self-start rounded px-2 ml-3">
                <PriceBadge price={video.price} />
              </span>
            )}
          </FeatureGate>
        </div>
        <FeatureGate feature="BO_WEB_APP_PRICES" fallback={null}>
          <div className="mb-4">
            <Typography.Body size="small" className="text-gray-700">
              This is an agreed price for your organization
            </Typography.Body>
          </div>
        </FeatureGate>
        <VideoInfo video={video} />
      </div>

      <div className={s.descriptionAndButtons}>
        <div>
          <VideoBadges video={video} />
          <FeatureGate product={Product.B2B} fallback={null}>
            {showLicensingDetails && <VideoLicensingDetails video={video} />}
          </FeatureGate>
        </div>
        <div className={(s.sticky, s.buttons)}>
          <div className={s.iconButtons}>
            {isAuthenticated && <AddToPlaylistButton videoId={video?.id} />}
            <FeatureGate product={Product.B2B}>
              <CopyVideoLinkButton video={video} onClick={trackVideoCopy} />
            </FeatureGate>
            {videoHasTranscript && <DownloadTranscriptButton video={video} />}
          </div>
          <FeatureGate product={Product.B2B}>
            {video?.links?.createEmbedCode ? (
              <EmbedButton video={video} iconOnly={false} />
            ) : (
              <FeatureGate linkName="cart">
                <AddToCartButton
                  video={video}
                  width="200px"
                  onClick={() => {
                    AnalyticsFactory.hotjar().event(
                      HotjarEvents.AddToCartFromVideoPage,
                    );
                  }}
                />
              </FeatureGate>
            )}
          </FeatureGate>
          <FeatureGate product={Product.CLASSROOM}>
            <VideoShareCodeButton video={video} />
          </FeatureGate>
        </div>
      </div>
    </>
  );
};
