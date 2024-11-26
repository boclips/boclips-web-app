import { BoclipsClient } from 'boclips-api-client';
import { ContentPackage } from 'boclips-api-client/dist/sub-clients/contentPackages/model/ContentPackage';
import { useBoclipsClient } from '@components/common/providers/BoclipsClientProvider';
import { useQuery } from '@tanstack/react-query';

export const doGetContentPackage = (
  contentPackageId: string,
  apiClient: BoclipsClient,
): Promise<ContentPackage> => {
  return apiClient.contentPackages.get(contentPackageId);
};

export const useGetContentPackage = (contentPackageId: string) => {
  const apiClient = useBoclipsClient();
  return useQuery(['contentPackage'], () =>
    doGetContentPackage(contentPackageId, apiClient),
  );
};
