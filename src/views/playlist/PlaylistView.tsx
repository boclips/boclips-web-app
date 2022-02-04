import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { usePlaylistQuery } from 'src/hooks/api/playlistsQuery';
import { useParams } from 'react-router-dom';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { VideoLibraryCard } from 'src/components/playlists/VideoLibraryCard';
import s from 'src/components/playlists/style.module.less';

const PlaylistView = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = usePlaylistQuery(id);

  return (
    <Layout rowsSetup="grid-rows-default-view-with-title" responsiveLayout>
      <Navbar />
      <FeatureGate feature="BO_WEB_APP_ENABLE_PLAYLISTS">
        {data && (
          <>
            <h2 className="grid-row-start-2 col-start-2 col-end-26">
              {data.title}
            </h2>
            <div className="grid-row-start-3 grid-row-end-3 col-start-2 col-end-26">
              <div className="grid">
                <div className="grid-row-start-1 grid-row-end-1 col-start-1 col-end-26 pb-5">
                  {data.description}
                </div>
                <h4 className="grid-row-start-2 grid-row-end-2 col-start-1 col-end-26 border-t pt-4">
                  In this playlist:
                </h4>
                <div
                  className={`${s.videoLibraryCardWrapper} grid-row-start-3 grid-row-end-3`}
                >
                  {!isLoading &&
                    data.videos?.map((v) => {
                      return <VideoLibraryCard key={v.id} videoId={v.id} />;
                    })}
                </div>
              </div>
            </div>
          </>
        )}
      </FeatureGate>
      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default PlaylistView;
