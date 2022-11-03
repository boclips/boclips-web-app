import React from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import PerformanceIcon from 'resources/icons/performance.svg';
import InsightsIcon from 'resources/icons/insights.svg';
import { TextButton } from 'src/components/common/textButton/TextButton';
import c from 'classnames';
import s from './dashboardHeader.module.less';

interface Props {
  showPerformanceDashboard: boolean;
  showInsightDashboard: boolean;
  handlePerformanceButtonClick: () => void;
  handleInsightButtonClick: () => void;
}

export const DashboardHeader = ({
  showPerformanceDashboard,
  showInsightDashboard,
  handleInsightButtonClick,
  handlePerformanceButtonClick,
}: Props) => {
  return (
    <PageHeader
      title="Your Quarterly Video Dashboard"
      subTitle="(Oct-Dec 2022)"
      button={
        <div className={c('flex flex-row', s.icons)}>
          <TextButton
            className={c(s.performanceIcon, {
              [s.activePerformanceButton]: showPerformanceDashboard,
            })}
            onClick={handlePerformanceButtonClick}
            text="Performance"
            icon={<PerformanceIcon />}
          />
          <TextButton
            className={c(s.insightsIcon, {
              [s.activeInsightButton]: showInsightDashboard,
            })}
            onClick={handleInsightButtonClick}
            text="Content Insights"
            icon={<InsightsIcon />}
          />
        </div>
      }
    />
  );
};
