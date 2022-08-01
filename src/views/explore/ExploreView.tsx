import { Typography } from '@boclips-ui/typography';
import React, { useEffect, useState } from 'react';
import { useGetBooksQuery } from 'src/hooks/api/bookQuery';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import c from 'classnames';
import s from './style.module.less';
import { BookList } from 'src/views/explore/BookList';

const ExploreView = () => {
  const { data: books } = useGetBooksQuery();
  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentSubjectBooks, setCurrentSubjectBooks] = useState([]);
  useEffect(() => {
    setSubjects(books?.map((book) => book.subject));
  }, [books]);

  useEffect(() => {
    setCurrentSubject(subjects && subjects[0]);
  }, [subjects]);

  useEffect(() => {
    setCurrentSubjectBooks(
      books?.filter((book) => subjects && book.subject === currentSubject),
    );
  }, [currentSubject]);

  return (
    <Layout rowsSetup="grid-rows-explore-view" responsiveLayout>
      <Navbar />
      <Typography.H1
        size="lg"
        className="col-start-2 col-end-26 grid-row-start-2 grid-row-end-2"
      >
        Our best content aligned to OpenStax courses
      </Typography.H1>

      <Typography.H2
        size="md"
        className="col-start-2 col-end-26 grid-row-start-3 grid-row-end-3 font-normal"
      >
        Review videos hand-picked by our curators and decide if they are right
        for your course
      </Typography.H2>
      <div className="col-start-2 col-end-26 grid-row-start-4 grid-row-end-4 text-center">
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            {subjects?.map((subject) => {
              return (
                <li>
                  <Typography.Body
                    onClick={() => setCurrentSubject(subject)}
                    className={c(
                      s.menuItem,
                      `inline-block p-4 rounded-t border-b-6 border-transparent hover:text-blue-800 hover:border-blue-800 hover:font-medium ${
                        currentSubject === subject
                          ? 'text-blue-800 border-blue-800 font-medium'
                          : ''
                      }`,
                    )}
                  >
                    {subject}
                  </Typography.Body>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <main className="col-start-1 col-end-27 grid-row-start-5 grid-row-end-5">
        <BookList books={currentSubjectBooks} />
      </main>

      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default ExploreView;
