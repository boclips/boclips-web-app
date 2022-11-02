import React from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import PerformanceIcon from 'resources/icons/performance.svg';
import InsightsIcon from 'resources/icons/insights.svg';
import { TextButton } from 'src/components/common/textButton/TextButton';
import c from 'classnames';
import s from './dashboardHeader.module.less';

export const DashboardHeader = () => {
  return (
    <PageHeader
      title="Your Quarterly Video Dashboard"
      subTitle="(Oct-Dec 2022)"
      button={
        <div className={c('flex flex-row', s.icons)}>
          <TextButton
            className={s.performanceIcon}
            onClick={null}
            text="Performance"
            icon={<PerformanceIcon />}
          />
          <TextButton
            className={s.insightsIcon}
            onClick={null}
            text="Content Insights"
            icon={<InsightsIcon />}
          />
        </div>
      }
    />
  );
};
