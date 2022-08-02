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
import SadFace from 'resources/icons/sad_face.svg';
import s from './style.module.less';

const OpenstaxBookView = () => {
  const { id: bookId } = useParams<PathWithId>();
  const { data: book } = useGetBook(bookId);

  const renderEmptySection = () => {
    const messaging =
      "We don't have any videos for this section yet. We're working on it!";
    return (
      <>
        <div className={s.emptyCard}>
          <div className="bg-blue-400 flex items-center justify-center">
            <SadFace />
          </div>
          <div />
        </div>
        <Typography.Body weight="medium" className="text-gray-700">
          {messaging}
        </Typography.Body>
      </>
    );
  };

  const renderSection = (section: Section, chapter: Chapter) => (
    <>
      <Typography.H3 size="xs" className="text-gray-800 font-normal">
        {`${chapter.number}.${section.number} ${section.title}`}
      </Typography.H3>

      <div className="grid grid-cols-4 gap-6">
        {section.videos.length === 0 && renderEmptySection()}
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
