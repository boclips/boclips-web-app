import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { useParams } from 'react-router';
import { PathWithId } from 'src/components/common/PathWithId';
import { useGetBook } from 'src/hooks/api/openstaxQuery';
import { OpenstaxBookContent } from 'src/components/openstax/book/OpenstaxBookContent';
import { OpenstaxBookNavigationPanel } from 'src/components/openstax/book/OpenstaxBookNavigationPanel';
import { OpenstaxBookHeader } from 'src/components/openstax/book/OpenstaxBookHeader';

const OpenstaxBookView = () => {
  const { id: bookId } = useParams<PathWithId>();
  const { data: book } = useGetBook(bookId);

  return (
    <Layout rowsSetup="grid-rows-default-view-with-title">
      <Navbar />
      {book && (
        <>
          <OpenstaxBookNavigationPanel book={book} onClose={() => {}} />
          <OpenstaxBookHeader
            bookTitle={book.title}
            openCourseContent={() => {}}
          />
          <OpenstaxBookContent book={book} />
        </>
      )}
      <Footer />
    </Layout>
  );
};

export default OpenstaxBookView;
