import { Typography } from '@boclips-ui/typography';
import React from 'react';
import c from 'classnames';
import s from '@src/components/alignments/themePage/theme/style.module.less';
import NotFound from '@src/resources/icons/not-found.svg';
import { getVideoCountLabel } from '@src/services/getVideoCountLabel';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoGridCardContainer } from './VideoGridCardContainer';

export interface TargetInfo {
  id: string;
  title: string;
  videos: Video[];
}

interface Props {
  data: TargetInfo;
}

export const TargetDetails = ({ data }: Props) => {
  const videoCount = data.videos?.length;
  const numberOfVideosLabel = `(${getVideoCountLabel(videoCount)})`;

  return (
    <section className={c(s.target)} id={data.id}>
      <Typography.H3 size="xs" className="text-gray-800 my-4" weight="regular">
        {data.title}{' '}
        <span className="text-gray-700">{numberOfVideosLabel}</span>
      </Typography.H3>
      {videoCount > 0 ? (
        <VideoGridCardContainer videos={data.videos} />
      ) : (
        <EmptyMappingMessaging />
      )}
    </section>
  );
};

const EmptyMappingMessaging = () => (
  <div className={s.emptyMessagingGrid}>
    <div className={s.emptyCard}>
      <div className="bg-blue-500 flex items-center justify-center rounded-t">
        <NotFound />
      </div>
      <div />
    </div>
    <Typography.Body weight="medium" className="text-gray-700 !text-lg">
      We’re working on it! <br />
      These videos are coming soon!
    </Typography.Body>
  </div>
);
