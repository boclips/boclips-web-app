import React from 'react';
import { useGetPromotedPlaylistsQuery } from 'src/hooks/api/playlistsQuery';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';
import { Link } from 'react-router-dom';
import { Typography } from '@boclips-ui/typography';
import ChevronSVG from 'src/resources/icons/chevron.svg';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';
import 'pure-react-carousel/dist/react-carousel.es.css';
import './PromotedPlaylists.less';

export const FeaturedPlaylists = () => {
  const { data: playlists, isInitialLoading } = useGetPromotedPlaylistsQuery();
  // const location = useLocation();

  return (
    <div>
      <Typography.H3 className="mb-4">Featured Playlists</Typography.H3>
      {!isInitialLoading && playlists.length > 0 && (
        <CarouselProvider
          className="my-6"
          totalSlides={playlists?.length}
          naturalSlideWidth={10}
          naturalSlideHeight={20}
          visibleSlides={4}
        >
          <div className="relative px-4">
            <Slider className="h-56 m-auto">
              {playlists.map((playlist: ListViewCollection, key: number) => (
                <Slide index={key}>
                  <Link
                    to={{
                      pathname: `/playlists/${playlist.id}`,
                    }}
                    aria-label={`${playlist.title} grid card`}
                  >
                    <div className="mx-4 bg-white rounded-lg shadow-lg">
                      <Thumbnail video={playlist.videos[0]} />
                      <div className="m-3">
                        <Typography.H4>{playlist.title}</Typography.H4>
                        <Typography.Body>
                          {playlist.videos.length} videos
                        </Typography.Body>
                      </div>
                    </div>
                  </Link>
                </Slide>
              ))}
            </Slider>
            <ButtonBack className="absolute top-1/2 left-0">
              <ChevronSVG />
            </ButtonBack>
            <ButtonNext className="absolute top-1/2 right-0 transform rotate-180">
              <ChevronSVG />
            </ButtonNext>
          </div>
        </CarouselProvider>
      )}
    </div>
  );
};
