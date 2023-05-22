import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import React from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import Button from '@boclips-ui/button';
import AddNewTeamMemberModal from 'src/components/teamModal/AddNewTeamMemberModal';
import Footer from 'src/components/layout/Footer';
import PlusSign from 'resources/icons/plus-sign.svg';
import { UsersList } from 'src/components/usersList/UsersList';
import { FeatureGate } from 'src/components/common/FeatureGate';

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
            text="Add new user"
            icon={<PlusSign />}
            onClick={() => setIsModalOpen(!isModalOpen)}
          />
        }
      />
      <main
        tabIndex={-1}
        className="col-start-2 col-end-26 row-start-3 row-end-4 flex items-start"
      >
        <FeatureGate linkName="accountUsers" isView={false}>
          <UsersList />
        </FeatureGate>
      </main>
      {isModalOpen && (
        <AddNewTeamMemberModal closeModal={() => setIsModalOpen(false)} />
      )}
      <Footer />
    </Layout>
  );
};

export default MyTeamView;
