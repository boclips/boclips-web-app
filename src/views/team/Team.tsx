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
import EditTeamMemberModal from 'src/components/teamModal/EditTeamMemberModal';

const MyTeamView = () => {
  const [isNewUserModalOpen, setIsNewUserModalOpen] = React.useState(false);
  const [accountUserToEdit, setAccountUserToEdit] = React.useState(undefined);

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
            onClick={() => setIsNewUserModalOpen(true)}
          />
        }
      />
      <main
        tabIndex={-1}
        className="col-start-2 col-end-26 row-start-3 row-end-4 flex items-start"
      >
        <FeatureGate linkName="accountUsers" isView={false}>
          <UsersList onEditUser={(user) => setAccountUserToEdit(user)} />
        </FeatureGate>
      </main>
      {isNewUserModalOpen && (
        <AddNewTeamMemberModal
          closeModal={() => setIsNewUserModalOpen(false)}
        />
      )}
      {accountUserToEdit && (
        <EditTeamMemberModal
          userToUpdate={accountUserToEdit}
          closeModal={() => setAccountUserToEdit(undefined)}
        />
      )}
      <Footer />
    </Layout>
  );
};

export default MyTeamView;
