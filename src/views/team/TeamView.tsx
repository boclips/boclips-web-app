import { Layout } from '@src/components/layout/Layout';
import Navbar from '@src/components/layout/Navbar';
import React from 'react';
import PageHeader from '@src/components/pageTitle/PageHeader';
import Button from '@boclips-ui/button';
import AddNewTeamMemberModal from '@src/components/teamModal/AddNewTeamMemberModal';
import Footer from '@src/components/layout/Footer';
import PlusSign from 'resources/icons/plus-sign.svg';
import { UsersList } from '@src/components/usersList/UsersList';
import EditTeamMemberModal from '@src/components/teamModal/EditTeamMemberModal';
import { Helmet } from 'react-helmet';
import { RemoveTeamMemberModal } from '@src/components/teamModal/RemoveTeamMemberModal';
import { FeatureGate } from '@src/components/common/FeatureGate';

const TeamView = () => {
  const [isNewUserModalOpen, setIsNewUserModalOpen] = React.useState(false);
  const [accountUserToEdit, setAccountUserToEdit] = React.useState(undefined);
  const [accountUserToRemove, setAccountUserToRemove] =
    React.useState(undefined);

  return (
    <>
      <Helmet title="Team" />
      <Layout rowsSetup="my-team-view" responsiveLayout>
        <Navbar />
        <PageHeader
          title="Team"
          button={
            <FeatureGate fallback={null} linkName="createUser">
              <Button
                height="48px"
                text="Add member"
                icon={<PlusSign />}
                onClick={() => setIsNewUserModalOpen(true)}
              />
            </FeatureGate>
          }
        />
        <main
          tabIndex={-1}
          className="col-start-2 col-end-26 row-start-3 row-end-4 flex items-start"
        >
          <UsersList
            onEditUser={(accountUser) => setAccountUserToEdit(accountUser)}
            onRemoveUser={(accountUser) => setAccountUserToRemove(accountUser)}
          />
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
        {accountUserToRemove && (
          <RemoveTeamMemberModal
            user={accountUserToRemove}
            closeModal={() => setAccountUserToRemove(undefined)}
          />
        )}
        <Footer />
      </Layout>
    </>
  );
};

export default TeamView;
