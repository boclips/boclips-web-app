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
        setAssetsUrl(
          fetchedVideo.links.assets.getOriginalLink(),
        );
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
  // eslint-disable-next-line react/jsx-no-undef
  return <DownloadVideoAssetsButton downloadUrl={assetsUrl} />;
};

const NothingToDownload = ({ video }: { video: OrderItemVideo }) => (
  <a
    className="video-files__link"
    target="_blank"
    rel="noopener noreferrer"
    href={video._links.videoUpload.getOriginalLink()}
  >
    Go to Kaltura
  </a>
);

const Loading = () => <div>Loading...</div>;

const computeVideoStatus = (video?: OrderItemVideo) => {
  const maxResAvailable = video?.maxResolutionAvailable;
  if (
    video == null ||
    maxResAvailable === undefined ||
    maxResAvailable === null
  ) {
    return <Loading />;
  }

  if (!maxResAvailable) {
    return <NothingToDownload video={video} />;
  }

  return <DownloadVideoFiles video={video!} />;
};

const DownloadVideoFile = ({ video }: Props) => {
  return <span data-qa="video-files">{computeVideoStatus(video)}</span>;
};

export default DownloadVideoFile;
