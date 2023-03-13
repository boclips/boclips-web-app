import React, { useEffect, useMemo, useState } from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { BookList } from 'src/components/openstax/bookList/BookList';
import { SubjectsMenu } from 'src/components/openstax/menu/SubjectsMenu';
import {
  useGetBooksQuery,
  useGetTypesByProviderQuery,
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

  const { data: types, isLoading: areTypesLoading } =
    useGetTypesByProviderQuery(providerName);
  const [currentType, setCurrentType] = useState(ALL);

  const currentTypeThemes = useMemo(
    () =>
      currentType === ALL
        ? books
        : books?.filter((book) => types && book.subject === currentType),
    [types, currentType, books],
  );

  useEffect(() => {
    const firstBook = currentTypeThemes?.[0];
    const isNavFocused = document
      .querySelector('main')
      .contains(document.activeElement);

    if (firstBook !== undefined && isNavFocused) {
      const element: HTMLButtonElement = document.querySelector(
        `[aria-label="book ${firstBook.title}"]`,
      );
      element.focus();
    }
  }, [currentTypeThemes]);

  const isLoading = areBooksLoading || areTypesLoading;

  return provider ? (
    <Layout rowsSetup="grid-rows-explore-view" responsiveLayout>
      <Navbar />
      <AlignmentContextProvider provider={provider}>
        <ExploreHeader />
        <SubjectsMenu
          subjects={isLoading ? [] : [ALL, ...types]}
          currentSubject={currentType}
          onClick={setCurrentType}
          isLoading={isLoading}
        />

        <BookList books={currentTypeThemes} isLoading={isLoading} />
      </AlignmentContextProvider>
      <Footer />
    </Layout>
  ) : (
    <NotFound />
  );
};

export default ExploreView;
