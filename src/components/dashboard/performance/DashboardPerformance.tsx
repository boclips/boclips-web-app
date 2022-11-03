import React, { useState } from 'react';
import { SummaryBlock } from 'src/components/dashboard/performance/SummaryBlock';
import {
  useGetContracts,
  useGetRevenueQuery,
  useGetStatsQuery,
} from 'src/hooks/api/dashboard/dashboardQuery';
import c from 'classnames';
import { TopVideosBlock } from 'src/components/dashboard/performance/TopVideosBlock';
import { RevenueChart } from 'src/components/dashboard/performance/RevenueChart';
import Dropdown from 'react-dropdown';
import s from './dashboardPerformance.module.less';
import 'react-dropdown/style.css';

const DashboardPerformance = () => {
  const { data: stats } = useGetStatsQuery('allTime');
  const { data: contracts } = useGetContracts();
  const [contractId, setContractId] = useState<string>(
    '5f3a9aad36b6f20d883650bb',
  );

  const { data: revenue } = useGetRevenueQuery(contractId);

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
      {contracts && (
        <Dropdown
          className="w-80 mb-80"
          options={contracts.map((con) => con.contractName)}
          onChange={(contractName) => {
            setContractId(
              contracts.find((con) => con.contractName === contractName.value)
                .contractId,
            );
            window.scrollTo({ top: 0 });
          }}
          value={contracts[0].contractName}
          placeholder="Select contract"
        />
      )}
    </main>
  );
};

export default DashboardPerformance;
