import s from 'src/components/common/gridCard/style.module.less';
import Badge from '@boclips-ui/badge';
import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import Tooltip from '@boclips-ui/tooltip';
import { bestForInfo } from 'src/resources/bestFor';
import getFormattedDuration from 'src/services/getFormattedDuration';

const GridCardSubHeader = ({
  video,
  onClick,
}: {
  video: Video;
  onClick?: () => void;
}) => {
  const bestForTag = bestForInfo.find(
    (it) => it.title === video.bestFor[0]?.label,
  );

  return (
    <div className={s.videoSubheader}>
      {video.bestFor[0] && (
        <span data-qa="tooltip">
          <Tooltip text={bestForTag?.description} asChild={false}>
            <Badge value={bestForTag?.title} />
          </Tooltip>
        </span>
      )}
      {video.playback.duration && (
        <Badge value={getFormattedDuration(video.playback.duration)} />
      )}
      <button onClick={onClick} type="button">
        <Typography.Body as="div" size="small" className={s.createdBy}>
          {video.createdBy}
        </Typography.Body>
      </button>
    </div>
  );
};

export default GridCardSubHeader;
