import React, { useEffect } from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { OrderItemVideo } from 'boclips-api-client/dist/sub-clients/orders/model/OrderItem';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import DownloadVideoAssetsButton from 'src/components/common/DownloadVideoAssetsButton';

interface Props {
  video?: OrderItemVideo;
  additionalOnClick?: () => void;
}

const DownloadVideoFiles = ({
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
      .then((_fetchedVideo: Video) => {
        setAssetsUrl(
          'https://api.staging-boclips.com/v1/videos/5e2ff495878dfc00fcdb0d11/assets',
        );
      })
      .catch(() => setAssetsUrl('NOT FOUND'));
  }, [video, apiClient]);

  if (!assetsUrl || assetsUrl === 'NOT FOUND') {
    return null;
  }
  return (
    <DownloadVideoAssetsButton
      downloadUrl={assetsUrl}
      additionalOnClick={additionalOnClick}
    />
  );
};

const NothingToDownload = () => <div>~Download unavailable</div>;

const computeVideoStatus = (
  video?: OrderItemVideo,
  additionalOnClick?: () => void,
) => {
  const maxResAvailable = video?.maxResolutionAvailable;
  if (
    video == null ||
    maxResAvailable === undefined ||
    maxResAvailable === null
  ) {
    return null;
  }

  if (!maxResAvailable) {
    return <NothingToDownload />;
  }

  return (
    <DownloadVideoFiles video={video!} additionalOnClick={additionalOnClick} />
  );
};

const DownloadVideoFile = ({ video, additionalOnClick }: Props) => {
  return (
    <span data-qa="video-files">
      {computeVideoStatus(video, additionalOnClick)}
    </span>
  );
};

export default DownloadVideoFile;
