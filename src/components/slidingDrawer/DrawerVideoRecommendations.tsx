import React, { useEffect, useState } from 'react';
import { Typography } from '@boclips-ui/typography';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { RecommendationService } from 'src/components/slidingDrawer/RecommendationService';

interface Props {
  videosAddedThusFar: Video[];
  // onVideoAdded: (video: Video) => void;
}

const DrawerVideoRecommendations = ({ videosAddedThusFar }: Props) => {
  const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
  const apiClient = useBoclipsClient();

  useEffect(() => {
    const fetchRecommendedVideos = async (videoIds: string[]) => {
      Promise.all(videoIds.map((id) => apiClient.videos.get(id))).then((it) =>
        setRecommendedVideos(it),
      );
    };

    const one = async () => {
      const recommendations = await RecommendationService.fromCurrentVideos(
        videosAddedThusFar.map((it) => it.id),
      );
      await fetchRecommendedVideos(recommendations);
    };

    one().catch((err) => console.log(err));
  }, [videosAddedThusFar]);

  return (
    <>
      {console.log(`>>> ${recommendedVideos}`)}
      {recommendedVideos.length > 0 && (
        <div>
          <Typography.H1 size="xs">Recommended videos</Typography.H1>
          {recommendedVideos.map((it) => (
            <section>{it.title}</section>
          ))}
        </div>
      )}
    </>
  );
};

export default DrawerVideoRecommendations;
