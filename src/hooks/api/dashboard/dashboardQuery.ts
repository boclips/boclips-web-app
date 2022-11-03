import axios, { AxiosResponse } from 'axios';
import { Revenue } from 'src/hooks/api/dashboard/Revenue';
import { Stats } from 'src/hooks/api/dashboard/Stats';
import { useQuery } from '@tanstack/react-query';

const STAGING_URL =
  'https://api.staging-boclips.com/v1/beta/contracts/5f3a9aad36b6f20d883650bb'; // music matters

// const STAGING_URL =
//   'https://api.staging-boclips.com/v1/beta/contracts/5ee0bf5bbb6460e03f3f9ec9'; // bozeman

// const STAGING_URL =
//   'https://api.staging-boclips.com/v1/beta/contracts/5ee0bf5bbb6460e03f3f9ecf'; // complexly

export async function doGetRevenueQuery(): Promise<Revenue> {
  return axios
    .get<Revenue>(`${STAGING_URL}/revenueReal`)
    .then((response: AxiosResponse<Revenue>) => {
      return response.data;
    });
}

export const useGetRevenueQuery = () => {
  return useQuery(['revenue'], async () => doGetRevenueQuery());
};

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
