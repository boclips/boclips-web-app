import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import React from 'react';
import Footer from 'src/components/layout/Footer';
import { Helmet } from 'react-helmet';
import { TrapDoorInterestSignUp } from 'src/components/trapdoor/TrapDoorInterestSignUp';

interface Props {
  feature: string;
}

const TrapDoorView = ({ feature }: Props) => {
  return (
    <>
      <Helmet title="Register Interest" />
      <Layout rowsSetup="grid-rows-home" responsiveLayout>
        <Navbar />
        <TrapDoorInterestSignUp feature={feature} />
        <Footer />
      </Layout>
    </>
  );
};

export default TrapDoorView;
