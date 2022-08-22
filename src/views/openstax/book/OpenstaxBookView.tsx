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
import s from 'src/views/openstax/book/style.module.less';
import c from 'classnames';

const OpenstaxBookView = () => {
  const { id: bookId } = useParams<PathWithId>();
  const { data: book } = useGetBook(bookId);
  const isDesktop = useMediaBreakPoint().type === 'desktop';
  const [tableOfContentsIsOpen, setTableOfContentsIsOpen] = useState(false);
  const tableOfContentsIsVisible = tableOfContentsIsOpen || isDesktop;

  const showTableOfContent = () => setTableOfContentsIsOpen(true);
  const hideTableOfContent = () => setTableOfContentsIsOpen(false);

  const columnStart = isDesktop ? 'col-start-8' : 'col-start-2';

  return (
    <Layout rowsSetup="grid-rows-openstax-detailed-view" responsiveLayout>
      <Navbar />
      {book && (
        <>
          {tableOfContentsIsVisible && (
            <div
              className={c('col-start-2 col-end-8 row-start-2 row-end-2', {
                [s.overlay]: !isDesktop,
                [s.sticky]: isDesktop,
              })}
            >
              <OpenstaxBookNavigationPanel
                book={book}
                onClose={hideTableOfContent}
              />
            </div>
          )}
          <div className={c(columnStart, 'col-end-26 row-start-2 row-end-3')}>
            <OpenstaxBookHeader
              bookTitle={book.title}
              openCourseContent={showTableOfContent}
            />
            <OpenstaxBookContent book={book} />
          </div>
        </>
      )}
      <Footer />
    </Layout>
  );
};

export default OpenstaxBookView;
