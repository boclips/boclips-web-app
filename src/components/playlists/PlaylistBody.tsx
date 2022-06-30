import React from 'react';
import c from 'classnames';
import PlaylistAddIcon from 'src/resources/icons/playlist-add.svg';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import { Typography } from '@boclips-ui/typography';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import VideoGridCard from 'src/components/common/gridCard/VideoGridCard';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import s from './style.module.less';

interface Props {
  playlist: Collection;
}

const PlaylistBody = ({ playlist }: Props) => {
  const mainRef: React.RefObject<HTMLElement> = React.useRef();

  const isEmptyPlaylist = playlist.videos && playlist.videos.length === 0;

  const shouldRemoveVideoCardFromView = (
    playlistId: string,
    cleanUp: () => void,
  ) => {
    if (playlistId === playlist.id) {
      cleanUp();
      mainRef.current.focus();
    }
  };

  const renderVideoCardWithButtons = (video: Video) => (
    <VideoGridCard
      video={video}
      onAddToCart={() => {
        AnalyticsFactory.appcues().sendEvent(
          AppcuesEvent.ADD_TO_CART_FROM_PLAYLIST_PAGE,
        );
      }}
      onCleanupAddToPlaylist={shouldRemoveVideoCardFromView}
    />
  );

  const header = isEmptyPlaylist ? undefined : (
    <Typography.H2
      size="sm"
      className="grid-row-start-4 grid-row-end-4 col-start-2 col-end-26 mb-0 text-gray-900"
    >
      In this playlist:
    </Typography.H2>
  );

  const content = isEmptyPlaylist ? (
    <Typography.H3 size="xs" weight="regular" data-qa="emptyPlaylistText">
      Save interesting videos to this playlist. Simply click the
      <PlaylistAddIcon className={s.addSvg} role="img" />
      button on any video to get started.
    </Typography.H3>
  ) : (
    playlist.videos.map(renderVideoCardWithButtons)
  );

  return (
    <>
      {header}
      <main
        tabIndex={-1}
        ref={mainRef}
        className={
          isEmptyPlaylist
            ? c(
                s.emptyPlaylistWrapper,
                'grid-row-start-4 grid-row-end-4 col-start-2 col-end-26',
              )
            : c(
                s.cardWrapper,
                'grid-row-start-5 grid-row-end-5 col-start-2 col-end-26',
              )
        }
      >
        {content}
      </main>
    </>
  );
};

export default PlaylistBody;
