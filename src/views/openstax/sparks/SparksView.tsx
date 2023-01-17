import React, { useEffect, useMemo, useState } from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { BookList } from 'src/components/openstax/bookList/BookList';
import { SubjectsMenu } from 'src/components/openstax/menu/SubjectsMenu';
import {
  useGetBooksQuery,
  useGetOpenstaxSubjectsQuery,
} from 'src/hooks/api/openstaxQuery';
import SparksHeader from 'src/components/openstax/sparksHeader/SparksHeader';

const SparksView = () => {
  const ALL = 'All';
  const { data: books, isLoading: areBooksLoading } = useGetBooksQuery();
  const { data: subjects, isLoading: areSubjectsLoading } =
    useGetOpenstaxSubjectsQuery();
  const [currentSubject, setCurrentSubject] = useState(ALL);

  const currentSubjectBooks = useMemo(
    () =>
      currentSubject === ALL
        ? books
        : books?.filter((book) => subjects && book.subject === currentSubject),
    [books, subjects, currentSubject],
  );

  useEffect(() => {
    const firstBook = currentSubjectBooks?.[0];
    const isNavFocused = document
      .querySelector('main')
      .contains(document.activeElement);

    if (firstBook !== undefined && isNavFocused) {
      const element: HTMLButtonElement = document.querySelector(
        `[aria-label="book ${firstBook.title}"]`,
      );
      element.focus();
    }
  }, [currentSubjectBooks]);

  const isLoading = areBooksLoading || areSubjectsLoading;

  return (
    <Layout rowsSetup="grid-rows-sparks-view" responsiveLayout>
      <Navbar />
      <SparksHeader />
      <SubjectsMenu
        subjects={isLoading ? [] : [ALL, ...subjects]}
        currentSubject={currentSubject}
        onClick={setCurrentSubject}
        isLoading={isLoading}
      />

      <BookList books={currentSubjectBooks} isLoading={isLoading} />
      <Footer />
    </Layout>
  );
};

export default SparksView;
