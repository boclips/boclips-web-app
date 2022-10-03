import { Typography } from '@boclips-ui/typography';
import React from 'react';
import c from 'classnames';
import s from 'src/components/openstax/book/style.module.less';
import SadFace from 'src/resources/icons/sad_face.svg';
import { getVideoCountLabel } from 'src/services/getVideoCountLabel';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoGridCardContainer } from './VideoGridCardContainer';

export interface ChapterElementInfo {
  id: string;
  displayLabel: string;
  videos: Video[];
}

interface Props {
  info: ChapterElementInfo;
}

export const ChapterElement = ({ info }: Props) => {
  const videoCount = info.videos?.length;
  const numberOfVideosLabel = `(${getVideoCountLabel(videoCount)})`;

  return (
    <section className={c(s.section)} id={info.id}>
      <Typography.H3 size="xs" className="text-gray-800 my-4" weight="regular">
        {info.displayLabel}{' '}
        <span className="text-gray-700">{numberOfVideosLabel}</span>
      </Typography.H3>
      {videoCount > 0 ? (
        <VideoGridCardContainer videos={info.videos} />
      ) : (
        renderEmptyMappingMessaging()
      )}
    </section>
  );
};

const renderEmptyMappingMessaging = () => (
  <div className={s.emptyMessagingGrid}>
    <div className={s.emptyCard}>
      <div className="bg-blue-500 flex items-center justify-center rounded-t">
        <SadFace />
      </div>
      <div />
    </div>
    <Typography.Body weight="medium" className="text-gray-700 !text-lg">
      We don&apos;t have any videos for this section yet. <br /> We&apos;re
      working on it!
    </Typography.Body>
  </div>
);
