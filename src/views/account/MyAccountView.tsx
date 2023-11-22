import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import React from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import Footer from 'src/components/layout/Footer';
import { Helmet } from 'react-helmet';
import { Typography } from '@boclips-ui/typography';
import { useGetAccount, useGetUserQuery } from 'src/hooks/api/userQuery';
import dayjs from 'dayjs';
import s from './style.module.less';

const MyAccountView = () => {
  const { data: user } = useGetUserQuery();
  const { data: account } = useGetAccount(user.account?.id);

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-uk', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Helmet title="My Account" />
      <Layout rowsSetup="my-account-view" responsiveLayout>
        <Navbar />
        <PageHeader title="My Account" />
        <main
          tabIndex={-1}
          className="col-start-2 col-end-13 row-start-3 row-end-4 flex flex-col"
        >
          <Typography.H2 size="sm" className="mb-4">
            Personal Profile
          </Typography.H2>
          <section className={s.infoCard}>
            <div>
              <Typography.Body>Name:</Typography.Body>
              <Typography.Body
                className={s.info}
              >{`${user?.firstName} ${user?.lastName}`}</Typography.Body>
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
          </section>
        </main>
        {user.account && (
          <section className="col-start-2 col-end-13 row-start-4 row-end-5 flex flex-col">
            <Typography.H2 size="sm" className="mb-4">
              Organization Profile
            </Typography.H2>
            <section className={s.infoCard}>
              <div>
                <Typography.Body>Name:</Typography.Body>
                <Typography.Body
                  className={s.info}
                >{`${user?.account.name}`}</Typography.Body>
              </div>
              <div>
                <Typography.Body>Signup date:</Typography.Body>
                <Typography.Body className={s.info}>
                  {formatDate(account?.createdAt)}
                </Typography.Body>
              </div>
              <div>
                <Typography.Body>Length of access:</Typography.Body>
                <Typography.Body className={s.info}>
                  {`${dayjs.duration(account?.accountDuration).asDays()} days`}
                </Typography.Body>
              </div>
            </section>
          </section>
        )}
        <section className="col-start-2 col-end-24 row-start-5 row-end-6 flex flex-col">
          <Typography.Body>
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
        <Footer />
      </Layout>
    </>
  );
};

export default MyAccountView;
