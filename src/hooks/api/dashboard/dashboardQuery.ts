import axios, { AxiosResponse } from 'axios';
import { Revenue } from 'src/hooks/api/dashboard/Revenue';
import { Contract, Stats } from 'src/hooks/api/dashboard/Stats';
import { useQuery } from '@tanstack/react-query';

const STAGING_URL =
  'https://api.staging-boclips.com/v1/beta/contracts/5f3a9aad36b6f20d883650bb'; // music matters

// const STAGING_URL =
//   'https://api.staging-boclips.com/v1/beta/contracts/5ee0bf5bbb6460e03f3f9ec9'; // bozeman

// const STAGING_URL =
//   'https://api.staging-boclips.com/v1/beta/contracts/5ee0bf5bbb6460e03f3f9ecf'; // complexly

export async function doGetRevenueQuery(contractId: string): Promise<Revenue> {
  return axios
    .get<Revenue>(
      `https://api.staging-boclips.com/v1/beta/contracts/${contractId}/revenueReal`,
    )
    .then((response: AxiosResponse<Revenue>) => {
      return response.data;
    });
}

export const useGetRevenueQuery = (contractId: string) => {
  return useQuery(['revenue', contractId], async () =>
    doGetRevenueQuery(contractId),
  );
};

export const useGetContracts = () => {
  return useQuery(['contracts'], async () => doGetContractsQuery());
};

export async function doGetContractsQuery(): Promise<Contract[]> {
  return axios
    .get<Contract[]>(`https://api.staging-boclips.com/v1/beta/contracts`)
    .then((response: AxiosResponse<Contract[]>) => {
      return response.data;
    });
}

export async function doGetStatsQuery(type: string): Promise<Stats> {
  return axios
    .get<Stats>(`${STAGING_URL}/stats?type=${type}`)
    .then((response: AxiosResponse<Stats>) => {
      return response.data;
    });
}
export const useGetStatsQuery = (type: string) => {
  return useQuery(['stats'], async () => doGetStatsQuery(type));
};
