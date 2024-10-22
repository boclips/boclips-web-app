import React from 'react';
import c from 'classnames';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { Typography } from '@boclips-ui/typography';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import VideoGridCard from 'src/components/videoCard/VideoGridCard';
import { FilterKey } from 'src/types/search/FilterKey';
import { useSearchQueryLocationParams } from 'src/hooks/useLocationParams';
import { PlaylistBodyEmptyState } from 'src/components/playlists/emptyState/EmptyState';
import { VideoCardWrapper } from 'src/components/videoCard/VideoCardWrapper';
import PlaylistVideoCardButtons from 'src/components/videoCard/buttons/PlaylistVideoCardButtons';
import { VideoCardButtons } from 'src/components/videoCard/buttons/VideoCardButtons';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { HotjarEvents } from 'src/services/analytics/hotjar/Events';
import CommentButton from 'src/components/playlists/comments/CommentButton';
import { CollectionAsset } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionAsset';
import s from '../style.module.less';

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

  const isEmptyPlaylist = playlist.assets && playlist.assets.length === 0;

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

  const classroomVideoCardButtons = (video: Video) => {
    return (
      <PlaylistVideoCardButtons
        video={video}
        onCleanupAddToPlaylist={shouldRemoveVideoCardFromView}
        playlistId={playlist.id}
      />
    );
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
        className={c({
          [s.emptyPlaylistWrapper]: isEmptyPlaylist,
          [s.modeList]: mode === 'LIST',
          [s.cardWrapperGrid]: mode === 'GRID',
        })}
      >
        {isEmptyPlaylist ? (
          <PlaylistBodyEmptyState />
        ) : (
          playlist?.assets?.map((asset: CollectionAsset) =>
            mode === 'LIST' ? (
              <VideoCardWrapper
                key={asset.id}
                video={asset.video}
                handleFilterChange={handleFilterChange}
                disableTitleLink={disableLinks}
                buttonsRow={
                  showButtons && classroomVideoCardButtons(asset.video)
                }
                segment={asset.segment}
              />
            ) : (
              <VideoGridCard
                key={asset.id}
                video={asset.video}
                handleFilterChange={handleFilterChange}
                disableLink={disableLinks}
                buttonsRow={showButtons && videoCardButtons(asset.video, true)}
              />
            ),
          )
        )}
      </main>
    </>
  );
};

export default PlaylistBody;
