import React from 'react';
import { Tooltip } from 'boclips-ui';

interface Props {
  restrictions: string;
}

export const VideoRestrictionsLabel = ({ restrictions }: Props) => (
  <p
    data-qa="video-restriction-details"
    className="flex flex-row items-center gap-1 truncate"
  >
    <Tooltip text={restrictions}>
      <span data-qa="video-restriction-tooltip">{restrictions}</span>
    </Tooltip>
  </p>
);
