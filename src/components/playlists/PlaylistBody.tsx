import React from 'react';
import c from 'classnames';
import GridCard from 'src/components/common/gridCard/GridCard';
import PlaylistAddIcon from 'src/resources/icons/playlist-add.svg';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { FeatureGate } from 'src/components/common/FeatureGate';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import CoverWithVideo from 'src/components/playlists/coverWithVideo/CoverWithVideo';
import { Typography } from '@boclips-ui/typography';
import { PriceBadge } from 'src/components/common/price/PriceBadge';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
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
    <GridCard
      link={`/videos/${video.id}`}
      key={video.id}
      name={video.title}
      header={<CoverWithVideo video={video} />}
      price={
        video.price && <PriceBadge price={video.price} className="text-xl" />
      }
      footer={
        <div className="flex flex-row justify-between p-1 self-end">
          <AddToPlaylistButton
            videoId={video.id}
            onCleanup={shouldRemoveVideoCardFromView}
          />

          <FeatureGate linkName="cart">
            <AddToCartButton
              video={video}
              key="cart-button"
              width="100px"
              removeButtonWidth="120px"
              labelAdd="Add"
              appcueEvent={AppcuesEvent.ADD_TO_CART_FROM_PLAYLIST_PAGE}
            />
          </FeatureGate>
        </div>
      }
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
