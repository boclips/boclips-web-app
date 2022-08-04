import { Typography } from '@boclips-ui/typography';
import React, { useEffect, useMemo, useState } from 'react';
import { useGetBooksQuery } from 'src/hooks/api/bookQuery';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { BookList } from 'src/components/book/BookList';
import { Menu } from 'src/components/menu/Menu';
import c from 'classnames';
import s from './style.module.less';

const ExploreView = () => {
  const { data: books } = useGetBooksQuery();
  const [currentSubject, setCurrentSubject] = useState('');

  const subjects = useMemo(
    () =>
      books
        ?.map((book) => book.subject)
        .filter((subject, index, self) => self.indexOf(subject) === index),
    [books],
  );

  useEffect(() => {
    setCurrentSubject(subjects && subjects[0]);
  }, [subjects]);

  const currentSubjectBooks = useMemo(
    () => books?.filter((book) => subjects && book.subject === currentSubject),
    [books, subjects, currentSubject],
  );

  return (
    <Layout rowsSetup="grid-rows-explore-view gap-y-6" responsiveLayout>
      <Navbar />
      <Typography.H1
        size="lg"
        className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2 mt-4 text-center"
      >
        Our best content aligned to OpenStax courses
      </Typography.H1>

      <Typography.H2
        size="xs"
        weight="regular"
        className="col-start-2 col-end-26 grid-row-start-3 grid-row-end-3 text-center -mt-4"
      >
        Review videos hand-picked by our curators and decide if they are right
        for your course
      </Typography.H2>

      <div className="col-start-2 col-end-26 grid-row-start-4 grid-row-end-4 -mt-2">
        <Menu
          subjects={subjects}
          currentSubject={currentSubject}
          onClick={setCurrentSubject}
        />
      </div>
      <main
        className={c(
          s.bookList,
          'col-start-2 col-end-26 grid-row-start-5 grid-row-end-5 relative -mt-6',
        )}
      >
        <BookList books={currentSubjectBooks} />
      </main>

      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default ExploreView;
