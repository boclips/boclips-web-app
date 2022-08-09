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
  const breakpoints = useMediaBreakPoint();
  const isDesktop = breakpoints.type === 'desktop';
  const [tocIsVisible, setTocIsVisible] = useState(isDesktop);

  const showTableOfContent = () => setTocIsVisible(true);
  const hideTableOfContent = () => setTocIsVisible(false);

  return (
    <Layout rowsSetup="grid-rows-default-view-with-title" responsiveLayout>
      <Navbar />
      {book && (
        <>
          {tocIsVisible && (
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
