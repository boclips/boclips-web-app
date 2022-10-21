import React, { useMemo, useState } from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { BookList } from 'src/components/openstax/bookList/BookList';
import { SubjectsMenu } from 'src/components/openstax/menu/SubjectsMenu';
import {
  useGetBooksQuery,
  useGetOpenstaxSubjectsQuery,
} from 'src/hooks/api/openstaxQuery';
import ExploreHeader from 'src/components/openstax/exploreHeader/ExploreHeader';

const ExploreView = () => {
  const ALL = 'All';
  const { data: books, isLoading } = useGetBooksQuery();
  const { data: subjects } = useGetOpenstaxSubjectsQuery();
  const [currentSubject, setCurrentSubject] = useState(ALL);

  const currentSubjectBooks = useMemo(
    () =>
      currentSubject === ALL
        ? books
        : books?.filter((book) => subjects && book.subject === currentSubject),
    [books, subjects, currentSubject],
  );

  return (
    <Layout rowsSetup="grid-rows-explore-view" responsiveLayout>
      <Navbar />
      <ExploreHeader />
      {subjects && (
        <SubjectsMenu
          subjects={[ALL, ...subjects]}
          currentSubject={currentSubject}
          onClick={setCurrentSubject}
          isLoading={isLoading}
        />
      )}
      <BookList books={currentSubjectBooks} isLoading={isLoading} />
      <Footer />
    </Layout>
  );
};

export default ExploreView;
