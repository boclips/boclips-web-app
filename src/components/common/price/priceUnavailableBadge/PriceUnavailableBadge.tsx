import React from 'react';
import { Tooltip } from 'boclips-ui';

export const PriceUnavailableBadge = () => (
  <Tooltip text="For pricing information contact your local Pearson R&P team">
    <span className="border-2 border-gray-400 font-normal rounded text-gray-800 px-2">
      Price unavailable
    </span>
  </Tooltip>
);
