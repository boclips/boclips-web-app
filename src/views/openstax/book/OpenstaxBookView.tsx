import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { useParams } from 'react-router';
import { PathWithId } from 'src/components/common/PathWithId';
import { useGetBook } from 'src/hooks/api/openstaxQuery';
import { Content } from 'src/components/openstax/book/Content';
import { NavigationPanel } from 'src/components/openstax/navigationPanel/NavigationPanel';
import { OpenstaxMobileMenuProvider } from 'src/components/common/providers/OpenstaxMobileMenuProvider';

const OpenstaxBookView = () => {
  const { id: bookId } = useParams<PathWithId>();
  const { data: book, isLoading } = useGetBook(bookId);

  return (
    <Layout
      rowsSetup="grid-rows-openstax-detailed-view items-start"
      responsiveLayout
    >
      <Navbar />
      {!isLoading && (
        <OpenstaxMobileMenuProvider>
          <NavigationPanel book={book} />
          <Content book={book} />
        </OpenstaxMobileMenuProvider>
      )}
      <Footer />
    </Layout>
  );
};

export default OpenstaxBookView;
