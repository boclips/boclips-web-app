import s from 'src/components/common/gridCard/style.module.less';
import Badge from '@boclips-ui/badge';
import { Typography } from '@boclips-ui/typography';
import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';

const GridCardSubHeader = ({
  video,
  onClick,
}: {
  video: Video;
  onClick?: () => void;
}) => {
  return (
    <div className={s.videoSubheader}>
      {video.bestFor[0] && <Badge value={video.bestFor[0].label} />}
      {video.price && (
        <Typography.Body as="span" size="small">
          {createPriceDisplayValue(
            video.price?.amount,
            video.price?.currency,
            getBrowserLocale(),
          )}
        </Typography.Body>
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
