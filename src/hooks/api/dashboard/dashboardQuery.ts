import axios, { AxiosResponse } from 'axios';
import { Revenue } from 'src/hooks/api/dashboard/Revenue';
import { Stats } from 'src/hooks/api/dashboard/Stats';
import { useQuery } from '@tanstack/react-query';

const STAGING_URL = 'https://api.staging-boclips.com/v1/beta/contracts/1234';

export async function doGetRevenueQuery(): Promise<Revenue> {
  return axios
    .get<Revenue>(`${STAGING_URL}/revenue`)
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
