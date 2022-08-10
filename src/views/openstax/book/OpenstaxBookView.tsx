import React, { useState } from 'react';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { useParams } from 'react-router';
import { PathWithId } from 'src/components/common/PathWithId';
import { useGetBook } from 'src/hooks/api/openstaxQuery';
import { OpenstaxBookContent } from 'src/components/openstax/book/OpenstaxBookContent';
import { OpenstaxBookNavigationPanel } from 'src/components/openstax/book/OpenstaxBookNavigationPanel';
import { OpenstaxBookHeader } from 'src/components/openstax/book/OpenstaxBookHeader';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';

const OpenstaxBookView = () => {
  const { id: bookId } = useParams<PathWithId>();
  const { data: book } = useGetBook(bookId);
  const isDesktop = useMediaBreakPoint().type === 'desktop';
  const [tableOfContentsIsOpen, setTableOfContentsIsOpen] = useState(false);
  const tableOfContentsIsVisible = tableOfContentsIsOpen || isDesktop;

  const showTableOfContent = () => setTableOfContentsIsOpen(true);
  const hideTableOfContent = () => setTableOfContentsIsOpen(false);

  return (
    <Layout rowsSetup="grid-rows-default-view-with-title" responsiveLayout>
      <Navbar />
      {book && (
        <>
          {tableOfContentsIsVisible && (
            <OpenstaxBookNavigationPanel
              book={book}
              onClose={hideTableOfContent}
            />
          )}
          <OpenstaxBookHeader
            bookTitle={book.title}
            openCourseContent={showTableOfContent}
          />
          <OpenstaxBookContent book={book} />
        </>
      )}
      <Footer />
    </Layout>
  );
};

export default OpenstaxBookView;
