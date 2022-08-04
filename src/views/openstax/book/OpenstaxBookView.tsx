import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { useParams } from 'react-router';
import { PathWithId } from 'src/components/common/PathWithId';
import { useGetBook } from 'src/hooks/api/openstaxQuery';
import { OpenstaxBookDetails } from 'src/components/openstax/book/OpenstaxBookDetails';
import { OpenstaxBookNavigationPanel } from 'src/components/openstax/book/OpenstaxBookNavigationPanel';

const OpenstaxBookView = () => {
  const { id: bookId } = useParams<PathWithId>();
  const { data: book } = useGetBook(bookId);

  return (
    <Layout rowsSetup="grid-rows-default-view">
      <Navbar />
      {book && (
        <>
          <OpenstaxBookNavigationPanel book={book} />
          <OpenstaxBookDetails book={book} />
        </>
      )}
      <Footer />
    </Layout>
  );
};

export default OpenstaxBookView;
