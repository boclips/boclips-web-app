import { renderHook, waitFor } from '@testing-library/react';
import { wrapperWithClients } from 'src/testSupport/wrapper';
import { QueryClient } from '@tanstack/react-query';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import {
  useUserAccountLicensedContentQuery,
  useUserLicensedContentQuery,
} from 'src/hooks/api/licensedContentQuery';

describe('licensesQuery', () => {
  it('get users licenses', async () => {
    const apiClient = new FakeBoclipsClient();
    const licensesSpy = jest.spyOn(
      apiClient.licenses,
      'getUserLicensedContent',
    );
    // @ts-ignore
    apiClient.licenses.getUserLicensedContent = licensesSpy;
    const { result } = renderHook(() => useUserLicensedContentQuery(1, 10), {
      wrapper: wrapperWithClients(apiClient, new QueryClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(licensesSpy).toBeCalledWith(1, 10);
  });

  it('get account licenses', async () => {
    const apiClient = new FakeBoclipsClient();
    const licensesSpy = jest.spyOn(
      apiClient.licenses,
      'getAccountLicensedContent',
    );
    // @ts-ignore
    apiClient.licenses.getAccountLicensedContent = licensesSpy;
    const { result } = renderHook(
      () => useUserAccountLicensedContentQuery(0, 10),
      {
        wrapper: wrapperWithClients(apiClient, new QueryClient()),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(licensesSpy).toBeCalledWith(0, 10);
  });
});
