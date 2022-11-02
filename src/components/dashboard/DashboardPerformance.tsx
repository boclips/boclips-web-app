import React from "react";
import { useGetRevenueQuery } from "src/hooks/api/dashboard/dashboardQuery";

const DashboardPerformance = () => {
  const revenue = useGetRevenueQuery();
  // const { data: stats } = useGetStatsQuery('allTime');

  return (
    <main
      tabIndex={-1}
      className="grid grid-cols-6 gap-6 col-start-2 col-end-26"
    >
      <div className="col-start-1 col-end-3 shadow-md">
        {revenue && revenue}
      </div>
      <div className="col-start-3 col-end-7 shadow-md"></div>

      <div className="col-start-1 col-end-7 shadow-md"></div>
    </main>
  );
};

export default DashboardPerformance;
