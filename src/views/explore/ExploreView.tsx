import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { useGetBooksQuery } from 'src/hooks/api/bookQuery';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';

const ExploreView = () => {
  const { data: books } = useGetBooksQuery();
  const subjects = new Set(books?.map((book) => book.subject));
  console.log(books);
  return (
    <Layout rowsSetup="grid-rows-playlist-view" responsiveLayout>
      <Navbar />
      <Typography.H1
        size="lg"
        className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2 text-center"
      >
        Our best content aligned to OpenStax courses
      </Typography.H1>

      <Typography.H2
        size="md"
        weight="regular"
        className="col-start-2 col-end-26 grid-row-start-3 grid-row-end-3 text-center"
      >
        Review videos hand-picked by our curators and decide if they are right
        for your course
      </Typography.H2>
      <div className="col-start-2 col-end-26 grid-row-start-4 grid-row-end-4 text-center">
        {Array.from(subjects).map((subject) => {
          return <Typography.Body> {subject} </Typography.Body>;
        })}
      </div>
      <main className="col-start-2 col-end-26 grid-row-start-5 grid-row-end-5">
        <span>List of books</span>
      </main>

      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default ExploreView;
