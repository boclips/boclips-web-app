import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { usePlaylistQuery } from 'src/hooks/api/playlistsQuery';
import { useParams } from 'react-router-dom';
import { FeatureGate } from 'src/components/common/FeatureGate';

const PlaylistView = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = usePlaylistQuery(id);

  return (
    <Layout rowsSetup="grid-rows-default-view-with-title" responsiveLayout>
      <Navbar />
      <FeatureGate feature="BO_WEB_APP_ENABLE_PLAYLISTS">
        {data && (
          <>
            <h2 className="grid-row-start-2 col-start-2 col-end-26">
              {data.title}
            </h2>
            <div className="grid-row-start-3 col-start-2 col-end-26">
              {data.description}
            </div>
          </>
        )}
      </FeatureGate>
      <Footer columnPosition="col-start-2 col-end-26" />
    </Layout>
  );
};

export default PlaylistView;
