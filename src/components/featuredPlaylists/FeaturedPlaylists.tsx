import React, { useMemo } from 'react';
import { useGetPromotedPlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Carousel } from 'src/components/common/carousel/Carousel';
import { PlaylistSlide } from 'src/components/featuredPlaylists/PlaylistSlide';
import s from './styles.module.less';

export const FeaturedPlaylists = () => {
  const { data: retrievedPlaylists, isInitialLoading } =
    useGetPromotedPlaylistsQuery();

  const nonEmptyPlaylists = useMemo(
    () => retrievedPlaylists?.filter((playlist) => playlist.videos.length > 0),
    [retrievedPlaylists],
  );

  const playlistSlides = useMemo(
    () =>
      nonEmptyPlaylists?.map((playlist) => (
        <PlaylistSlide key={playlist.id} playlist={playlist} />
      )),
    [nonEmptyPlaylists],
  );

  if (isInitialLoading) {
    return null;
  }

  if (nonEmptyPlaylists.length === 0) {
    return null;
  }

  return (
    <div className={s.carouselWrapper}>
      <Carousel slides={playlistSlides} />
    </div>
  );
};
