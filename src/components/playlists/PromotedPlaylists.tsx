import React from 'react';
import { useGetPromotedPlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import { Typography } from '@boclips-ui/typography';
import 'pure-react-carousel/dist/react-carousel.es.css';
import './PromotedPlaylists.less';
import { Carousel } from 'src/components/common/carousel/Carousel';
import { Link } from 'react-router-dom';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';

export const FeaturedPlaylists = () => {
  const { data: retrievedPlaylists, isInitialLoading } =
    useGetPromotedPlaylistsQuery();

  const getPlaylistSlides = (playlists) =>
    playlists.map((playlist: ListViewCollection) => (
      <Link
        to={{
          pathname: `/playlists/${playlist.id}`,
        }}
        aria-label={`${playlist.title} grid card`}
      >
        <div className="mx-4 bg-white rounded-lg shadow-lg pb-2 h-64">
          <Thumbnail video={playlist.videos[0]} />
          <div className="m-3 flex justify-between h-24 flex-col">
            <Typography.H4 className="truncate">{playlist.title}</Typography.H4>
            <Typography.Body>{playlist.videos.length} videos</Typography.Body>
          </div>
        </div>
      </Link>
    ));
  const getNonEmptyPlaylists = (allPlaylists: ListViewCollection[]) =>
    allPlaylists.filter(
      (playlist: ListViewCollection) => playlist.videos.length > 0,
    );

  return (
    <div className="rounded-xl bg-blue-100 ">
      {!isInitialLoading &&
        getNonEmptyPlaylists(retrievedPlaylists).length > 0 && (
          <Carousel
            slides={getPlaylistSlides(getNonEmptyPlaylists(retrievedPlaylists))}
            title="Featured Playlists"
          />
        )}
    </div>
  );
};
