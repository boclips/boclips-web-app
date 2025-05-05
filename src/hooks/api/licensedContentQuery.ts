import { useQuery } from '@tanstack/react-query';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';

export const useUserLicensedContentQuery = (page: number, size: number) => {
  const client = useBoclipsClient();
  return useQuery(['licensedContent', page], () =>
    client.licenses.getUserLicensedContent(page, size),
  );
};

export const useUserAccountLicensedContentQuery = (
  page: number,
  size: number,
) => {
  const client = useBoclipsClient();
  return useQuery(['accountLicensedContent', page], () =>
    client.licenses.getAccountLicensedContent(page, size),
  );
};
