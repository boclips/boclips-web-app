import React from 'react';
import { useGetPromotedPlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import { Link } from 'react-router-dom';
import { Typography } from '@boclips-ui/typography';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';

export const FeaturedPlaylists = () => {
  const { data: playlists, isInitialLoading } = useGetPromotedPlaylistsQuery();
  // const location = useLocation();

  return (
    <div className="rounded mt-20">
      <Typography.H3 className="mb-4">Featured Playlists</Typography.H3>
      {!isInitialLoading && playlists.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          spaceBetween={30}
          loop
          pagination={{ clickable: true }}
          speed={2000}
          preventClicks={false}
          slidesPerView={4}
        >
          {playlists.map((playlist: ListViewCollection) => (
            <SwiperSlide>
              <Link
                to={{
                  pathname: `/playlists/${playlist.id}`,
                }}
                state={{
                  userNavigated: true,
                }}
                aria-label={`${playlist.title} grid card`}
              >
                <div className="bg-white rounded-lg shadow-lg p-4 mb-10 w-full">
                  <Thumbnail video={playlist.videos[0]} />
                  <Typography.H4>{playlist.title}</Typography.H4>
                  <Typography.Body>
                    {playlist.videos.length} videos
                  </Typography.Body>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};
