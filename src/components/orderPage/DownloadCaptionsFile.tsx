import React, { useEffect } from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import {
  OrderItemVideo,
  OrderCaptionStatus,
} from 'boclips-api-client/dist/sub-clients/orders/model/OrderItem';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import DownloadVideoCaptionsButton from 'src/components/common/DownloadVideoCaptionsButton';

interface Props {
  video?: OrderItemVideo;
  captionsRequested: boolean;
}

const DownloadCaptions = ({ video }: { video: OrderItemVideo }) => {
  const [assetsUrl, setAssetsUrl] = React.useState<
    string | undefined | 'ERROR'
  >();

  const apiClient = useBoclipsClient();

  useEffect(() => {
    apiClient.videos
      .getVideoProjection(video, 'fullProjection')
      .then((fetchedVideo: Video) => {
        setAssetsUrl(fetchedVideo.links.assets?.getOriginalLink());
      })
      .catch(() => setAssetsUrl('ERROR'));
  }, [video, apiClient]);

  if (!assetsUrl) {
    return <Loading />;
  }

  if (assetsUrl === 'ERROR') {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={video._links.videoUpload.getOriginalLink()}
      >
        Could not find download link for assets
      </a>
    );
  }
  return (
    <DownloadVideoCaptionsButton
      downloadUrl={assetsUrl}
      videoTitle={video.title}
    />
  );
};

const RequestCaptions = ({ video }: { video: OrderItemVideo }) => (
  <a
    className="video-files__link"
    target="_blank"
    rel="noopener noreferrer"
    href={video._links.captionAdmin.getOriginalLink()}
  >
    Go to Kaltura
  </a>
);

const CaptionsRequested = () => <div>Captions requested</div>;

const CaptionsProcessing = () => <div>Processing captions</div>;

const Loading = () => <div>Loading...</div>;

const computeVideoStatus = (
  video?: OrderItemVideo,
  captionsRequested?: boolean,
) => {
  if (
    video?.captionStatus === OrderCaptionStatus.AVAILABLE &&
    captionsRequested
  ) {
    return <DownloadCaptions video={video!} />;
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
        return <RequestCaptions video={video} />;
      case OrderCaptionStatus.PROCESSING:
        return <CaptionsProcessing />;
      default: {
        return <Loading />;
      }
    }
  }
  return null;
};

const DownloadCaptionsFile = ({ video, captionsRequested }: Props) => {
  return (
    <span data-qa="caption-files">
      {computeVideoStatus(video, captionsRequested)}
    </span>
  );
};

export default DownloadCaptionsFile;
