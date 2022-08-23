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
import { TextButton } from 'src/components/common/textButton/TextButton';
import { useHistory } from 'react-router-dom';
import BackArrow from 'src/resources/icons/back-arrow.svg';

const OpenstaxBookView = () => {
  const { id: bookId } = useParams<PathWithId>();
  const { data: book } = useGetBook(bookId);
  const isDesktop = useMediaBreakPoint().type === 'desktop';
  const [tableOfContentsIsOpen, setTableOfContentsIsOpen] = useState(false);
  const tableOfContentsIsVisible = tableOfContentsIsOpen || isDesktop;
  const history = useHistory();

  const showTableOfContent = () => setTableOfContentsIsOpen(true);
  const hideTableOfContent = () => setTableOfContentsIsOpen(false);

  const columnStart = isDesktop ? 'col-start-8' : 'col-start-2';

  const goToExplorePage = () => {
    history.push('/explore/openstax');
  };

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
            {!isDesktop && (
              <TextButton
                onClick={goToExplorePage}
                text="Back"
                icon={<BackArrow />}
              />
            )}
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
