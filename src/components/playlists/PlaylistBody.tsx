import React from 'react';
import c from 'classnames';
import PlaylistAddIcon from 'src/resources/icons/playlist-add.svg';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import { Typography } from '@boclips-ui/typography';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import VideoGridCard from 'src/components/videoCard/VideoGridCard';
import { FilterKey } from 'src/types/search/FilterKey';
import { useSearchQueryLocationParams } from 'src/hooks/useLocationParams';
import CommentButton from 'src/views/playlist/comments/CommentButton';
import s from './style.module.less';
import { VideoCardButtons } from '../videoCard/buttons/VideoCardButtons';

interface Props {
  playlist: Collection;
}

const PlaylistBody = ({ playlist }: Props) => {
  const [searchLocation, setSearchLocation] = useSearchQueryLocationParams();
  const { filters: filtersFromURL } = searchLocation;

  const isEmptyPlaylist = playlist.videos && playlist.videos.length === 0;

  const shouldRemoveVideoCardFromView = (
    playlistId: string,
    cleanUp: () => void,
  ) => {
    if (playlistId === playlist.id) {
      cleanUp();
      setTimeout(() => {
        document.querySelector('main')?.focus();
      }, 100);
    }
  };

  const handleFilterChange = (key: FilterKey, values: string[]) => {
    const newFilters = { ...filtersFromURL, [key]: values };

    setSearchLocation({
      pathName: '/videos',
      query: '',
      page: 1,
      filters: newFilters,
    });
  };

  return (
    <>
      {!isEmptyPlaylist && (
        <section
          className="grid-row-start-4 grid-row-end-4 col-start-2 col-end-26"
          aria-labelledby="in-this-playlist"
        >
          <Typography.H2
            size="sm"
            className="mb-0 text-gray-900"
            id="in-this-playlist"
          >
            In this playlist:
          </Typography.H2>
        </section>
      )}
      <main
        tabIndex={-1}
        className={
          isEmptyPlaylist
            ? c(s.emptyPlaylistWrapper, 'col-start-2 col-end-26')
            : c(
                s.cardWrapper,
                'grid-row-start-5 grid-row-end-5 col-start-2 col-end-26',
              )
        }
      >
        {isEmptyPlaylist ? (
          <EmptyCopy />
        ) : (
          playlist?.videos?.map((video: Video) => (
            <VideoGridCard
              key={video.id}
              video={video}
              handleFilterChange={handleFilterChange}
              buttonsRow={
                <VideoCardButtons
                  video={video}
                  iconOnly
                  onAddToCart={() => {
                    AnalyticsFactory.appcues().sendEvent(
                      AppcuesEvent.ADD_TO_CART_FROM_PLAYLIST_PAGE,
                    );
                  }}
                  onCleanupAddToPlaylist={shouldRemoveVideoCardFromView}
                  additionalSecondaryButtons={
                    <CommentButton videoId={video.id} collection={playlist} />
                  }
                />
              }
            />
          ))
        )}
      </main>
    </>
  );
};

const EmptyCopy = () => (
  <Typography.H3 size="xs" weight="regular" data-qa="emptyPlaylistText">
    Save interesting videos to this playlist. Simply click the
    <PlaylistAddIcon className={s.addSvg} role="img" />
    button on any video to get started.
  </Typography.H3>
);

export default PlaylistBody;
