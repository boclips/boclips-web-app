import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import { Layout } from 'src/components/layout/Layout';
import { usePlaylistQuery } from 'src/hooks/api/playlistsQuery';
import { useParams } from 'react-router-dom';
import { FeatureGate } from 'src/components/common/FeatureGate';
import c from 'classnames';
import { VideoLibraryCard } from 'src/components/videoLibraryCard/VideoLibraryCard';
import Footer from 'src/components/layout/Footer';
import { useGetVideos } from 'src/hooks/api/videoQuery';
import s from './style.module.less';

const PlaylistView = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading: playlistLoading } = usePlaylistQuery(id);
  const { data: videos, isLoading: videosLoading } = useGetVideos(
    data?.videos.map((it) => it.id),
  );

  return (
    <Layout rowsSetup="grid-rows-playlist-view" responsiveLayout>
      <Navbar />
      <FeatureGate feature="BO_WEB_APP_ENABLE_PLAYLISTS">
        {playlistLoading || videosLoading ? (
          <Skeleton />
        ) : (
          <>
            <h2 className="grid-row-start-2 grid-row-end-2 col-start-2 col-end-26">
              {data.title}
            </h2>
            <div
              className={c(
                s.description,
                'grid-row-start-3 grid-row-end-3 col-start-2 col-end-26',
              )}
            >
              {data.description}
            </div>
            <h4 className="grid-row-start-4 grid-row-end-4 col-start-2 col-end-26 mb-0">
              In this playlist:
            </h4>
            <div
              className={c(
                s.cardWrapper,
                'grid-row-start-5 grid-row-end-5 col-start-2 col-end-26',
              )}
            >
              {videos.map((v) => {
                return <VideoLibraryCard key={v.id} video={v} />;
              })}
            </div>
          </>
        )}
      </FeatureGate>
      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

const Skeleton = () => {
  return (
    <>
      <div
        className={c(
          s.skeleton,
          s.header,
          'grid-row-start-2 grid-row-end-2 col-start-2 col-end-26',
        )}
      />
      <div
        className={c(
          s.skeleton,
          s.description,
          'grid-row-start-3 grid-row-end-3 col-start-2 col-end-26',
        )}
      />
      <div
        className={c(
          s.skeleton,
          s.tab,
          'grid-row-start-4 grid-row-end-4 col-start-2 col-end-26',
        )}
      />
      <div
        className={c(
          s.skeleton,
          s.cardWrapper,
          'grid-row-start-5 grid-row-end-5 col-start-2 col-end-26',
        )}
      >
        <SkeletonTiles />
      </div>
    </>
  );
};

const SkeletonTiles = () => {
  const numberOfTiles = 8;
  const skeletonsToRender = Array.from(Array(numberOfTiles).keys());

  return (
    <>
      {skeletonsToRender.map((i) => (
        <div key={i} />
      ))}
    </>
  );
};

export default PlaylistView;
