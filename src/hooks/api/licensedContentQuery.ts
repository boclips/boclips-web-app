import { useQuery } from '@tanstack/react-query';
import { BoclipsClient } from 'boclips-api-client';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';

const doGetLicensedContent = (
  client: BoclipsClient,
  page?: number,
  size?: number,
) => client.licenses.getUserLicensedContent(page, size);

export const useLicensedContentQuery = (page: number, size: number) => {
  const client = useBoclipsClient();
  return useQuery(['licensedContent', page], () =>
    doGetLicensedContent(client, page, size),
  );
};
