import React from 'react';
import {
  CurrentPeriod,
  Period,
  Revenue,
} from 'src/hooks/api/dashboard/Revenue';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from 'recharts';
import { Typography } from '@boclips-ui/typography';

interface Props {
  revenueData: Revenue;
}

export const RevenueChart = ({ revenueData }: Props) => {
  const getChartData = () => {
    revenueData.closedPeriods.sort((a, b) => {
      return a.period < b.period ? -1 : 1;
    });

    const lastClosedPeriod: Period = revenueData.closedPeriods.pop();

    const lastClosedPeriodData: CurrentPeriod = {
      revenue: lastClosedPeriod.revenue,
      period: lastClosedPeriod.period,
      changeFromPreviousPercent: lastClosedPeriod.changeFromPreviousPercent,
      revenueEstimation: lastClosedPeriod.revenue,
      currentRevenue: lastClosedPeriod.revenue,
      startDate: '',
      endDate: '',
    };

    revenueData.closedPeriods.push(lastClosedPeriodData);
    revenueData.closedPeriods.push(revenueData.currentPeriod);

    return revenueData;
  };

  const renderLineChart = revenueData && (
    <ResponsiveContainer width="90%" height={350}>
      <LineChart data={getChartData().closedPeriods}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="period" />
        <YAxis
          type="number"
          domain={[0, (dataMax) => (Math.round(dataMax / 1000) + 1) * 1000]}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#00217D"
          strokeWidth={2}
          dot={{ stroke: '#00217D', strokeWidth: 4 }}
        >
          <LabelList dataKey="revenue" position="insideTopLeft" offset={10} />
        </Line>
        <ReferenceLine
          x={
            revenueData.closedPeriods[revenueData.closedPeriods.length - 2]
              .period
          }
          stroke="#10B981"
          strokeWidth={2}
          offset={10}
          label={{
            position: 'insideTopRight',
            value: 'Today',
            fill: '#10B981',
            fontSize: 14,
          }}
        />
        <Line
          type="monotone"
          dataKey="revenueEstimation"
          stroke="#8884d8"
          strokeDasharray="5 5"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="flex flex-col space-y-4">
      <Typography.H1 size="sm">
        Historical quarterly revenue and forecast
      </Typography.H1>
      <div className="flex flex-col justify-center">{renderLineChart}</div>
    </div>
  );
};
