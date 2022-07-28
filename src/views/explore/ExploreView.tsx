import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { useGetBooksQuery } from 'src/hooks/api/bookQuery';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';

export const ExploreView = () => {
  const { data: books } = useGetBooksQuery();
  const subjects = new Set(books?.map((book) => book.subject));
  console.log(books);
  return (
    <Layout rowsSetup="grid-rows-default-view-with-title" responsiveLayout>
      <Navbar />
      <section className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2 flex flex-col">
        <div className="w-full h-12 justify-center">
          <Typography.H1>
            Our best content aligned to OpenStax courses
          </Typography.H1>
        </div>

        <div className="w-full h-12 justify-center">
          <Typography.H2>
            Review videos hand-picked by our curators and decide if they are
            right for your course
          </Typography.H2>
        </div>
        <div className="w-full h-12 justify-center">
          {Array.from(subjects).map((subject) => {
            return <Typography.Body> {subject} </Typography.Body>;
          })}
        </div>
      </section>
      <div className="col-start-2 col-end-26 grid-row-start-3 grid-row-end-3 flex flex-row">List of books</div>

      <Footer />
    </Layout>
  );
};
