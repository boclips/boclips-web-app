import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import Footer from 'src/components/layout/Footer';
import Navbar from 'src/components/layout/Navbar';

const TrialWelcomeView = () => {
  return (
    <Layout rowsSetup="grid-rows-welcome-view" responsiveLayout>
      <Navbar showOptions={false} showSearch={false} />
      <div className="col-start-7 col-end-20 row-start-2 row-end-2">
        You&apos;ve just been added to Boclips by your colleague
      </div>
      <Footer className="col-start-2 col-end-26 row-start-6" />
    </Layout>
  );
};

export default TrialWelcomeView;
