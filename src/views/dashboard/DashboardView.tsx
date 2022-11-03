import { Helmet } from 'react-helmet';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import React, { useState } from 'react';
import { DashboardHeader } from 'src/components/dashboard/DashboardHeader';
import DashboardPerformance from 'src/components/dashboard/performance/DashboardPerformance';
import DashboardInsights from "src/components/dashboard/DashboardInsights";

const DashboardView = () => {
  const [showPerformanceDashboard, setShowPerformanceDashboard] =
    useState<boolean>(true);
  const [showInsightsDashboard, setShowInsightDashboard] =
    useState<boolean>(false);

  const handlePerformanceButtonClick = () => {
    setShowPerformanceDashboard(true);
    setShowInsightDashboard(false);
  };

  const handleInsightButtonClick = () => {
    setShowPerformanceDashboard(false);
    setShowInsightDashboard(true);
  };

  return (
    <>
      <Helmet title="Dashboard" />
      <Layout
        rowsSetup="grid-rows-library-view"
        className="bg-blue-100"
        responsiveLayout
      >
        <Navbar />
        <DashboardHeader
          showPerformanceDashboard={showPerformanceDashboard}
          showInsightDashboard={showInsightsDashboard}
          handlePerformanceButtonClick={handlePerformanceButtonClick}
          handleInsightButtonClick={handleInsightButtonClick}
        />
        {showPerformanceDashboard && <DashboardPerformance />}
        <DashboardInsights />
        <Footer columnPosition="col-start-2 col-end-26" />
      </Layout>
    </>
  );
};

export default DashboardView;
