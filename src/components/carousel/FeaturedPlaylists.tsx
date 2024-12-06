import React, { useMemo } from 'react';
import { useGetPromotedPlaylistsQuery } from '@src/hooks/api/playlistsQuery';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Carousel } from '@components/common/carousel/Carousel';
import { PromotedForProduct } from 'boclips-api-client/dist/sub-clients/collections/model/PromotedForProduct';
import { PlaylistSlide } from '@components/carousel/PlaylistSlide';
import s from './styles.module.less';

interface Props {
  product: 'CLASSROOM' | 'LIBRARY';
}

const FeaturedPlaylists = ({ product }: Props) => {
  let promotedFor: PromotedForProduct;
  switch (product) {
    case 'CLASSROOM':
      promotedFor = PromotedForProduct.CLASSROOM;
      break;
    case 'LIBRARY':
    default:
      promotedFor = PromotedForProduct.LIBRARY;
      break;
  }

  const { data: retrievedPlaylists, isInitialLoading } =
    useGetPromotedPlaylistsQuery(promotedFor);

  const nonEmptyPlaylists = useMemo(
    () => retrievedPlaylists?.filter((playlist) => playlist.assets.length > 0),
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

  if (nonEmptyPlaylists?.length === 0) {
    return null;
  }

  return (
    <div className={s.carouselWrapper}>
      <Carousel slides={playlistSlides} title="Featured Playlists" />
    </div>
  );
};

export default FeaturedPlaylists;
