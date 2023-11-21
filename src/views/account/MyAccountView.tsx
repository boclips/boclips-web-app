import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import React from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import Footer from 'src/components/layout/Footer';
import { Helmet } from 'react-helmet';
import { Typography } from '@boclips-ui/typography';
import { useGetUserQuery } from 'src/hooks/api/userQuery';
import s from './style.module.less';

const MyAccountView = () => {
  const { data: user } = useGetUserQuery();

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
            <div>
              <Typography.Body>Job Title:</Typography.Body>
              <Typography.Body
                className={s.info}
              >{`${user?.jobTitle}`}</Typography.Body>
            </div>
          </section>
        </main>
        <Footer />
      </Layout>
    </>
  );
};

export default MyAccountView;
