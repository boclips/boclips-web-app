import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
// import Footer from 'src/components/layout/Footer';
import React from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import Button from '@boclips-ui/button';
import AddNewTeamMemberModal from 'src/components/teamModal/AddNewTeamMemberModal';
import Footer from 'src/components/layout/Footer';

const MyTeamView = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <Layout rowsSetup="my-team-view" responsiveLayout>
      <Navbar />
      <PageHeader
        title="My team"
        button={
          <Button
            height="48px"
            text="+ Add new user"
            onClick={() => setIsModalOpen(!isModalOpen)}
          />
        }
      />
      {isModalOpen && (
        <AddNewTeamMemberModal closeModal={() => setIsModalOpen(false)} />
      )}
      <Footer />
    </Layout>
  );
};

export default MyTeamView;
