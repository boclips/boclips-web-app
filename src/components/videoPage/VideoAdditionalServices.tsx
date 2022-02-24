import InfoIcon from 'resources/icons/info.svg';
import React from 'react';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import { Constants } from 'src/AppConstants';

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
    <div className="mt-4 bg-blue-100 border-blue-400 border-2 p-6 rounded text-gray-800">
      <div className="flex flex-row font-medium text-base items-center mb-2 text-gray-900">
        <InfoIcon />
        <div className="ml-2">Additional services</div>
      </div>
      {!isLoadingUser && <div className="text-sm">{message}</div>}
    </div>
  );
};
