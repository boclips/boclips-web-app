import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import Footer from 'src/components/layout/Footer';
import Navbar from 'src/components/layout/Navbar';
import WelcomeHeader from 'src/components/welcome/WelcomeHeader';
import InvitedUserInfo from 'src/components/welcome/InvitedUserInfo';

const TrialWelcomeView = () => {
  return (
    <Layout rowsSetup="grid-rows-welcome-view" responsiveLayout>
      <Navbar showOptions={false} showSearch={false} />
      <WelcomeHeader />
      <InvitedUserInfo />
      <Footer className="col-start-2 col-end-26 row-start-6" />
    </Layout>
  );
};

export default TrialWelcomeView;
