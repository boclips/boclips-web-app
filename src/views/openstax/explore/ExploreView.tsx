import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useParams } from 'react-router';
import NotFound from 'src/views/notFound/NotFound';
import {
  getProviderByName,
  isProviderSupported,
} from 'src/views/openstax/provider/AlignmentProviderFactory';
import { AlignmentContextProvider } from 'src/components/common/providers/AlignmentContextProvider';

const ExploreView = () => {
  const ALL = 'All';
  const { provider: providerName } = useParams();
  const { data: books, isLoading: areBooksLoading } = useGetBooksQuery();

  const provider = isProviderSupported(providerName)
    ? getProviderByName(providerName)
    : undefined;

  const { data: subjects, isLoading: areSubjectsLoading } =
    useGetOpenstaxSubjectsQuery();
  const [currentSubject, setCurrentSubject] = useState(ALL);

  const getTypes = useCallback(
    () => (providerName === 'openstax' ? subjects : provider?.types),
    [provider, providerName, subjects],
  );

  const currentSubjectBooks = useMemo(
    () =>
      currentSubject === ALL
        ? books
        : books?.filter(
            (book) => getTypes() && book.subject === currentSubject,
          ),
    [currentSubject, books, getTypes],
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

  return provider ? (
    <Layout rowsSetup="grid-rows-explore-view" responsiveLayout>
      <Navbar />
      <AlignmentContextProvider provider={provider}>
        <ExploreHeader />
        <SubjectsMenu
          subjects={isLoading ? [] : [ALL, ...getTypes()]}
          currentSubject={currentSubject}
          onClick={setCurrentSubject}
          isLoading={isLoading}
        />

        <BookList books={currentSubjectBooks} isLoading={isLoading} />
      </AlignmentContextProvider>
      <Footer />
    </Layout>
  ) : (
    <NotFound />
  );
};

export default ExploreView;
