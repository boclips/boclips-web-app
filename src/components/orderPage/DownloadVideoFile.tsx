import React, { useEffect } from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { OrderItemVideo } from 'boclips-api-client/dist/sub-clients/orders/model/OrderItem';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import DownloadVideoAssetsButton from 'src/components/common/DownloadVideoAssetsButton';

interface Props {
  video?: OrderItemVideo;
}

const DownloadVideoFiles = ({ video }: { video: OrderItemVideo }) => {
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
  return <DownloadVideoAssetsButton downloadUrl={assetsUrl} />;
};

const NothingToDownload = () => <div>~Download unavailable</div>;

const computeVideoStatus = (video?: OrderItemVideo) => {
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

  return <DownloadVideoFiles video={video!} />;
};

const DownloadVideoFile = ({ video }: Props) => {
  return <span data-qa="video-files">{computeVideoStatus(video)}</span>;
};

export default DownloadVideoFile;
