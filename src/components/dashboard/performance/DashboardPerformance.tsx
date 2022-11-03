import React from 'react';
import { SummaryBlock } from 'src/components/dashboard/performance/SummaryBlock';
import {
  useGetRevenueQuery,
  useGetStatsQuery,
} from 'src/hooks/api/dashboard/dashboardQuery';
import c from 'classnames';
import { TopVideosBlock } from 'src/components/dashboard/performance/TopVideosBlock';
import { RevenueChart } from 'src/components/dashboard/performance/RevenueChart';
import s from './dashboardPerformance.module.less';

const DashboardPerformance = () => {
  const { data: revenue } = useGetRevenueQuery();
  const { data: stats } = useGetStatsQuery('allTime');

  return (
    <main
      tabIndex={-1}
      className="grid grid-cols-6 gap-6 col-start-2 col-end-26"
    >
      <div className="col-start-1 col-end-3 shadow-md bg-white">
        <SummaryBlock revenueData={revenue} statsData={stats} />
      </div>

      <div className="col-start-3 col-end-7 shadow-md p-6 bg-white">
        <RevenueChart revenueData={revenue} />
      </div>

      <div
        className={c(
          'flex flex-col p-6 col-start-1 col-end-7 shadow-md min-h-96 bg-white',
          s.topVideos,
        )}
      >
        <TopVideosBlock statsData={stats} />
      </div>
    </main>
  );
};

export default DashboardPerformance;
