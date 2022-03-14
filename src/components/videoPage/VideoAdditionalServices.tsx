import InfoIcon from 'resources/icons/info.svg';
import React from 'react';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { Constants } from 'src/AppConstants';
import { Typography } from '@boclips-ui/typography';

export const VideoAdditionalServices = () => {
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery();

  const userIsPearson =
    user?.organisation?.id === Constants.PEARSON_ORGANISATION_ID;

  const message = userIsPearson
    ? 'Captions, transcripts, video trimming, and other editing requests are ' +
      'available upon request from your shopping cart. All additional services are available free of charge.'
    : 'Captions, transcripts, video trimming, and other editing requests are ' +
      'available upon request from your shopping cart.';

  return (
    <div className="mt-2 lg:mt-4 bg-blue-100 p-6 rounded text-gray-800">
      <div className="flex flex-row items-center mb-2 text-gray-900">
        <InfoIcon />
        <Typography.Body weight="medium" className="ml-2">
          Additional services
        </Typography.Body>
      </div>
      {!isLoadingUser && <div className="text-sm">{message}</div>}
    </div>
  );
};
