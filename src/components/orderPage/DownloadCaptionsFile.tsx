import React, { useEffect } from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import {
  OrderCaptionStatus,
  OrderItemVideo,
} from 'boclips-api-client/dist/sub-clients/orders/model/OrderItem';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import DownloadVideoCaptionsButton from 'src/components/common/DownloadVideoCaptionsButton';

interface Props {
  video?: OrderItemVideo;
  captionsRequested: boolean;
  additionalOnClick: () => void;
}

const DownloadCaptions = ({
  video,
  additionalOnClick,
}: {
  video: OrderItemVideo;
  additionalOnClick?: () => void;
}) => {
  const [assetsUrl, setAssetsUrl] = React.useState<
    string | undefined | 'ERROR'
  >();

  const apiClient = useBoclipsClient();

  useEffect(() => {
    apiClient.videos
      .getVideoProjection(video, 'fullProjection')
      .then((fetchedVideo: Video) => {
        setAssetsUrl(fetchedVideo.links.assets.getOriginalLink());
      })
      .catch(() => setAssetsUrl('NOT FOUND'));
  }, [video, apiClient]);

  if (!assetsUrl || assetsUrl === 'NOT FOUND') {
    return null;
  }
  return (
    <DownloadVideoCaptionsButton
      downloadUrl={assetsUrl}
      videoTitle={video.title}
      additionalOnClick={additionalOnClick}
    />
  );
};

const CaptionsUnavailable = () => <div>Captions unavailable</div>;

const CaptionsRequested = () => <div>Captions requested</div>;

const CaptionsProcessing = () => <div>Processing captions</div>;

const computeVideoStatus = (
  video?: OrderItemVideo,
  captionsRequested?: boolean,
  additionalOnClick?: () => void,
) => {
  if (
    video?.captionStatus === OrderCaptionStatus.AVAILABLE &&
    captionsRequested
  ) {
    return (
      <DownloadCaptions video={video!} additionalOnClick={additionalOnClick} />
    );
  }

  return renderCaptionsNotReady(video, captionsRequested);
};

const renderCaptionsNotReady = (
  video?: OrderItemVideo,
  captionsRequested?: boolean,
) => {
  if (captionsRequested) {
    switch (video?.captionStatus) {
      case OrderCaptionStatus.REQUESTED:
        return <CaptionsRequested />;
      case OrderCaptionStatus.UNAVAILABLE:
        return <CaptionsUnavailable />;
      case OrderCaptionStatus.PROCESSING:
        return <CaptionsProcessing />;
      default: {
        return null;
      }
    }
  }
  return null;
};

const DownloadCaptionsFile = ({
  video,
  captionsRequested,
  additionalOnClick,
}: Props) => {
  return (
    <span data-qa="caption-files">
      {computeVideoStatus(video, captionsRequested, additionalOnClick)}
    </span>
  );
};

export default DownloadCaptionsFile;
