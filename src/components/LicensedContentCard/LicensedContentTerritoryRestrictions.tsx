import React, { useMemo } from 'react';
import { LicensedContent } from 'boclips-api-client/dist/sub-clients/licenses/model/LicensedContent';
import { Typography } from 'boclips-ui';
import countries from 'iso-3166-1';

const allCountries = countries.all().map((it) => it.country);

interface Props {
  licensedContent: LicensedContent;
}

const LicensedContentTerritoryRestrictions = ({ licensedContent }: Props) => {
  const restrictedTerritories = licensedContent.license.restrictedTerritories
    ? licensedContent.license.restrictedTerritories
    : [];
  const nonRestrictedTerritories = useMemo(
    () =>
      restrictedTerritories.length !== 0
        ? allCountries.filter((it) => !restrictedTerritories.includes(it))
        : [],
    [licensedContent.license.restrictedTerritories],
  );

  let displayedLabel = 'Restricted in:';
  let displayedTerritories =
    restrictedTerritories.length !== 0
      ? restrictedTerritories?.join(', ')
      : 'No restrictions';

  if (restrictedTerritories.length > nonRestrictedTerritories.length) {
    displayedLabel = 'Allowed only in:';
    displayedTerritories = nonRestrictedTerritories.join(', ');
  }

  return (
    <div className="flex flex-row gap-1">
      <Typography.Body weight="medium" size="small" className="text-nowrap">
        {displayedLabel}
      </Typography.Body>
      <Typography.Body size="small">{displayedTerritories}</Typography.Body>
    </div>
  );
};

export default LicensedContentTerritoryRestrictions;
