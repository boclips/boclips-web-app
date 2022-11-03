import React from 'react';
import { Revenue } from 'src/hooks/api/dashboard/Revenue';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { Typography } from '@boclips-ui/typography';

interface Props {
  revenueData: Revenue;
}

export const RevenueChart = ({ revenueData }: Props) => {
  const renderLineChart = revenueData && (
    <ResponsiveContainer width="90%" height={350}>
      <LineChart
        data={revenueData.revenue.sort((a, b) => {
          return a.period < b.period ? -1 : 1;
        })}
      >
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
          <LabelList dataKey="revenue" position="insideTopRight" offset={10} />
        </Line>
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
