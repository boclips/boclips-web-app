import { useQuery } from '@tanstack/react-query';
import { BoclipsClient } from 'boclips-api-client';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';

const doGetLicensedContent = (client: BoclipsClient) =>
  client.licenses.getUserLicensedContent();

export const useLicensedContentQuery = () => {
  const client = useBoclipsClient();
  return useQuery(['licensedContent'], () => doGetLicensedContent(client));
};
