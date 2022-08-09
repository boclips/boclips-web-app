import { Typography } from '@boclips-ui/typography';
import React from 'react';
import s from 'src/components/openstax/book/style.module.less';
import SadFace from 'src/resources/icons/sad_face.svg';
import { OpenstaxSection } from 'src/types/OpenstaxBook';
import { ResponsiveVideoGridCardContainer } from 'src/components/videoCard/ResponsiveVideoGridCardContainer';
import { getVideoCountLabel } from 'src/services/getVideoCountLabel';

interface Props {
  section: OpenstaxSection;
}
export const OpenstaxBookSection = ({ section }: Props) => {
  const hasMappedVideos = section.videos?.length > 0;
  const numberOfVideosLabel = `(${getVideoCountLabel(section.videoCount)})`;

  return (
    <div className={s.section}>
      <Typography.H3 size="xs" className="text-gray-800 mb-4" weight="regular">
        {section.displayLabel}{' '}
        <span className="text-gray-700">{numberOfVideosLabel}</span>
      </Typography.H3>
      {hasMappedVideos ? (
        <ResponsiveVideoGridCardContainer videos={section.videos} />
      ) : (
        renderEmptyMappingMessaging()
      )}
    </div>
  );
};

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
