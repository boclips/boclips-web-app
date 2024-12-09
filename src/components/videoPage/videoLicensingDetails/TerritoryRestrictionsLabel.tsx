import React from 'react';
import InfoSVG from '@resources/icons/info.svg?react';
import { Tooltip } from 'boclips-ui';

interface Props {
  territories: string[];
}

export const TerritoryRestrictionsLabel = ({ territories }: Props) => {
  const getLabel = () => {
    if (territories.length === 1) {
      return '1 country';
    }
    return `${territories.length} countries`;
  };

  return (
    <span className="flex flex-row items-center gap-1">
      <span>{getLabel()}</span>
      <Tooltip text={territories.join(', ')}>
        <button type="button" data-qa="territories-details">
          <InfoSVG onClick={null} />
        </button>
      </Tooltip>
    </span>
  );
};
