import React, { useEffect } from 'react';
import { Layout } from 'src/components/layout/Layout';
import Footer from 'src/components/layout/Footer';
import Navbar from 'src/components/layout/Navbar';
import WelcomeHeader from 'src/components/welcome/WelcomeHeader';
import InvitedUserInfo from 'src/components/welcome/InvitedUserInfo';
import MarketingInfoForm from 'src/components/welcome/MarketingInfoForm';
import useRedirectToWelcome from 'src/hooks/useRedirectToWelcome';

const TrialWelcomeView = () => {
  // useRedirectToWelcome();
  return (
    <Layout rowsSetup="grid-rows-welcome-view" responsiveLayout>
      <Navbar showOptions={false} showSearch={false} />
      <WelcomeHeader />
      <InvitedUserInfo />
      <MarketingInfoForm />
      <Footer className="col-start-2 col-end-26 row-start-6" />
    </Layout>
  );
};

export default TrialWelcomeView;
