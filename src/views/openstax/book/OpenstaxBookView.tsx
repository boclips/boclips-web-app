import React from 'react';
import { Layout } from 'src/components/layout/Layout';
import Navbar from 'src/components/layout/Navbar';
import PageHeader from 'src/components/pageTitle/PageHeader';
import Footer from 'src/components/layout/Footer';
import { useParams } from 'react-router';
import { PathWithId } from 'src/components/common/PathWithId';
import { useGetBook } from 'src/hooks/api/openstaxQuery';
import { Typography } from '@boclips-ui/typography';
import VideoGridCard from 'src/components/videoCard/VideoGridCard';
import {
  Chapter,
  Section,
} from 'boclips-api-client/dist/sub-clients/openstax/model/Books';

const OpenstaxBookView = () => {
  const { id: bookId } = useParams<PathWithId>();
  const { data: book } = useGetBook(bookId);

  const renderSection = (section: Section, chapter: Chapter) => (
    <>
      <Typography.H3 size="xs" className="text-gray-800 font-normal">
        {`${chapter.number}.${section.number} ${section.title}`}
      </Typography.H3>
      <div className="grid grid-cols-4 gap-6">
        {section.videos.map((video) => (
          <VideoGridCard video={video} />
        ))}
      </div>
    </>
  );

  return (
    <Layout rowsSetup="grid-rows-default-view-with-title">
      <Navbar />
      <PageHeader title={book?.title} />
      <main className="grid col-start-2 col-end-26 gap-4">
        {book?.chapters.map((chapter) => {
          return (
            <>
              <Typography.H2 size="sm" className="text-gray-700">
                {`Chapter ${chapter.number}: ${chapter.title}`}
              </Typography.H2>
              {chapter.sections.map((section) =>
                renderSection(section, chapter),
              )}
            </>
          );
        })}
      </main>
      <Footer />
    </Layout>
  );
};

export default OpenstaxBookView;
