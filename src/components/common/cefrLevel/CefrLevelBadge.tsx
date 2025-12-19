import React from 'react';
import { CefrLevel } from 'boclips-api-client/dist/sub-clients/videos/model/CefrLevel';
import Badge from '@boclips-ui/badge';
import { getCefrLevelLabel } from 'src/components/common/cefrLevel/GetCefrLevelLabel';

interface Props {
  cefrLevel: CefrLevel;
}

export const CefrLevelBadge = ({ cefrLevel }: Props) => {
  return (
    <div data-qa={`${cefrLevel}-cefr-level-badge`}>
      <Badge value={getCefrLevelLabel(cefrLevel)} />
    </div>
  );
};
