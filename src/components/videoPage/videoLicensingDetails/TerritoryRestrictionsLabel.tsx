import React from 'react';
import InfoSVG from 'src/resources/icons/info.svg';
import Tooltip from '@boclips-ui/tooltip';

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

  const getCountriesList = () => {
    if (territories.length === 1) {
      return territories[0];
    }
    return territories.join(', ');
  };

  return (
    <p className="flex flex-row items-center gap-1">
      <span>{getLabel()}</span>
      <Tooltip text={getCountriesList()}>
        <button type="button" data-qa="territories-details">
          <InfoSVG onClick={null} />
        </button>
      </Tooltip>
    </p>
  );
};
