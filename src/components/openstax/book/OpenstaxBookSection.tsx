import { Section } from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import { Typography } from '@boclips-ui/typography';
import VideoGridCard from 'src/components/videoCard/VideoGridCard';
import React from 'react';
import s from 'src/components/openstax/book/style.module.less';
import SadFace from 'src/resources/icons/sad_face.svg';
import { Video } from 'boclips-api-client/dist/types';

interface Props {
  section: Section;
  chapterNumber: number;
}
export const OpenstaxBookSection = ({ section, chapterNumber }: Props) => {
  const hasMappedVideos = section.videos.length > 0;

  const numberOfVideosLabel = `(${section.videos.length} ${
    section.videos.length === 1 ? 'video' : 'videos'
  })`;

  return (
    <div className={s.section}>
      <Typography.H3 size="xs" className="text-gray-800 !font-normal mb-4">
        {`${chapterNumber}.${section.number} ${section.title} `}
        <span className="text-gray-700">{numberOfVideosLabel}</span>
      </Typography.H3>
      {hasMappedVideos
        ? renderMappedVideos(section.videos)
        : renderEmptyMappingMessaging()}
    </div>
  );
};

const renderMappedVideos = (videos: Video[]) => (
  <div className="grid grid-cols-4 gap-6">
    {videos.map((video) => (
      <VideoGridCard video={video} />
    ))}
  </div>
);

const renderEmptyMappingMessaging = () => (
  <div className={s.emptyMessagingGrid}>
    <div className={s.emptyCard}>
      <div className="bg-blue-400 flex items-center justify-center">
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
