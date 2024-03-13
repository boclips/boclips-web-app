import React from 'react';
import c from 'classnames';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { Typography } from '@boclips-ui/typography';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import VideoGridCard from 'src/components/videoCard/VideoGridCard';
import { FilterKey } from 'src/types/search/FilterKey';
import { useSearchQueryLocationParams } from 'src/hooks/useLocationParams';
import CommentButton from 'src/components/playlists/comments/CommentButton';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import { PlaylistBodyEmptyState } from 'src/components/playlists/emptyState/EmptyState';
import { VideoCardWrapper } from 'src/components/videoCard/VideoCardWrapper';
import s from '../style.module.less';
import { VideoCardButtons } from '../../videoCard/buttons/VideoCardButtons';

interface Props {
  playlist: Collection;
  showButtons?: boolean;
  disableLinks?: boolean;
  mode?: 'GRID' | 'LIST';
}

const PlaylistBody = ({
  playlist,
  showButtons = true,
  disableLinks = false,
  mode = 'GRID',
}: Props) => {
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

  const videoCardButtons = (video: Video, iconOnly: boolean) => {
    return (
      <VideoCardButtons
        video={video}
        iconOnly={iconOnly}
        onAddToCart={() => {
          AnalyticsFactory.hotjar().event(
            HotjarEvents.AddToCartFromPlaylistPage,
          );
        }}
        onCleanupAddToPlaylist={shouldRemoveVideoCardFromView}
        additionalSecondaryButtons={
          <CommentButton videoId={video.id} collection={playlist} />
        }
      />
    );
  };

  const playListBodyClass = isEmptyPlaylist
    ? c(s.emptyPlaylistWrapper, 'col-start-2 col-end-26')
    : mode === 'LIST'
    ? 'col-start-2 col-end-20 '
    : c(
        s.cardWrapperGrid,
        'grid-row-start-5 grid-row-end-5 col-start-2 col-end-26',
      );

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
      <main tabIndex={-1} className={playListBodyClass}>
        {isEmptyPlaylist ? (
          <PlaylistBodyEmptyState />
        ) : (
          playlist?.videos?.map((video: Video) =>
            mode === 'LIST' ? (
              <VideoCardWrapper
                key={video.id}
                video={video}
                handleFilterChange={handleFilterChange}
                disableTitleLink={disableLinks}
                buttonsRow={showButtons && videoCardButtons(video, false)}
                segment={playlist.segments?.[video.id]}
              />
            ) : (
              <VideoGridCard
                key={video.id}
                video={video}
                handleFilterChange={handleFilterChange}
                disableLink={disableLinks}
                buttonsRow={showButtons && videoCardButtons(video, true)}
              />
            ),
          )
        )}
      </main>
    </>
  );
};

export default PlaylistBody;
