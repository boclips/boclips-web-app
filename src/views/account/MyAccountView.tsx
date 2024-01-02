import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import React, { useState } from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import Footer from 'src/components/layout/Footer';
import { Helmet } from 'react-helmet';
import { Typography } from '@boclips-ui/typography';
import { useGetAccount, useGetUserQuery } from 'src/hooks/api/userQuery';
import UserIcon from 'src/resources/icons/user-icon.svg';
import HomeIcon from 'src/resources/icons/home-icon.svg';
import c from 'classnames';
import Button from '@boclips-ui/button';
import PencilSVG from 'src/resources/icons/pencil.svg';
import EditPersonalProfileModal from 'src/views/account/EditPersonalProfileModal';
import s from './style.module.less';

const MyAccountView = () => {
  const { data: user, isLoading: userIsLoading } = useGetUserQuery();
  const [openEditProfileModal, setOpenEditProfileModal] =
    useState<boolean>(false);

  const { data: account, isLoading: accountIsLoading } = useGetAccount(
    user.account?.id,
  );

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-uk', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <>
      <Helmet title="My Account" />
      <Layout rowsSetup="grid-rows-my-account-view" responsiveLayout>
        <Navbar />
        <PageHeader title="My Account" />
        <main tabIndex={-1} className={s.profileSection}>
          <Typography.H2 size="sm" className="mb-4">
            Personal Profile
          </Typography.H2>
          <section className={c(s.infoCard, { [s.skeleton]: userIsLoading })}>
            <div>
              <Typography.Body>Name:</Typography.Body>
              <Typography.Body
                className={s.info}
              >{`${user?.firstName} ${user?.lastName}`}</Typography.Body>
              <Button
                onClick={() => {
                  setOpenEditProfileModal(true);
                }}
                className={s.editButton}
                text="Edit"
                icon={<PencilSVG aria-hidden />}
                type="label"
              />
            </div>
            <div>
              <Typography.Body>Email:</Typography.Body>
              <Typography.Body
                className={s.info}
              >{`${user?.email}`}</Typography.Body>
            </div>
            {user?.jobTitle && (
              <div>
                <Typography.Body>Job Title:</Typography.Body>
                <Typography.Body
                  className={s.info}
                >{`${user?.jobTitle}`}</Typography.Body>
              </div>
            )}
            <span className={s.profileIcon}>
              <div className={s.circle}>
                <span className={s.userIcon}>
                  <UserIcon />
                </span>
              </div>
            </span>
          </section>
        </main>
        <section className={s.organisationProfile}>
          <Typography.H2 size="sm" className={`mb-4 ${s.skeleton}`}>
            Organization Profile
          </Typography.H2>
          <section
            data-qa={accountIsLoading ? 'skeleton' : ''}
            className={c(s.infoCard, { [s.skeleton]: accountIsLoading })}
          >
            <div>
              <Typography.Body>Name:</Typography.Body>
              <Typography.Body
                className={s.info}
              >{`${user?.account.name}`}</Typography.Body>
            </div>
            {account?.createdAt && (
              <div>
                <Typography.Body>Created on:</Typography.Body>
                <Typography.Body className={s.info}>
                  {formatDate(account?.createdAt)}
                </Typography.Body>
              </div>
            )}
            <span className={s.profileIcon}>
              <div className={c(s.circle, s.homeIcon)}>
                <HomeIcon />
              </div>
            </span>
          </section>
        </section>
        <section className="col-start-2 col-end-24 row-start-5 row-end-6 justify-end flex flex-col">
          <Typography.Body size="small">
            For information on the account data we collect and for any requests
            to access or delete your data please refer to our{' '}
            <a
              rel="noopener noreferrer"
              href="https://www.boclips.com/privacy-policy"
              target="_blank"
            >
              <Typography.Link type="inline-blue">
                Privacy Policy.
              </Typography.Link>
            </a>
          </Typography.Body>
        </section>
        <Footer className="row-start-6" />
      </Layout>
      {openEditProfileModal && (
        <EditPersonalProfileModal
          userToUpdate={user}
          closeModal={() => setOpenEditProfileModal(false)}
        />
      )}
    </>
  );
};

export default MyAccountView;
