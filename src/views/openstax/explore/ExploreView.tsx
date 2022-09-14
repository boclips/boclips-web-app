import React, { useEffect, useMemo, useState } from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { BookList } from 'src/components/openstax/bookList/BookList';
import { SubjectsMenu } from 'src/components/openstax/menu/SubjectsMenu';
import { useGetBooksQuery } from 'src/hooks/api/openstaxQuery';
import ExploreHeader from 'src/components/openstax/exploreHeader/ExploreHeader';

const ExploreView = () => {
  const { data: books, isLoading } = useGetBooksQuery();
  const [currentSubject, setCurrentSubject] = useState('');

  const subjects = useMemo(
    () => Array.from(new Set(books?.map((book) => book.subject))),
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
    <Layout rowsSetup="grid-rows-explore-view" responsiveLayout>
      <Navbar />
      <ExploreHeader />
      <SubjectsMenu
        subjects={subjects}
        currentSubject={currentSubject}
        onClick={setCurrentSubject}
        isLoading={isLoading}
      />
      <BookList books={currentSubjectBooks} isLoading={isLoading} />
      <Footer />
    </Layout>
  );
};

export default ExploreView;
