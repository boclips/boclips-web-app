import React from 'react';
import c from 'classnames';
import PlaylistCard from 'src/components/playlists/playlistCard/PlaylistCard';
import PlaylistAddIcon from 'src/resources/icons/playlist-add.svg';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { FeatureGate } from 'src/components/common/FeatureGate';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import CoverWithVideo from 'src/components/playlists/coverWithVideo/CoverWithVideo';
import s from './style.module.less';
import { Main } from '../layout/Main';

interface Props {
  videos: Video[];
}

const buttons = (video: Video) => (
  <div className="flex flex-row justify-between p-1 self-end">
    <AddToPlaylistButton videoId={video.id} />

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
);

const EmptyPlaylist = () => (
  <div
    className={c(
      s.emptyPlaylistWrapper,
      'grid-row-start-4 grid-row-end-4 col-start-2 col-end-26',
    )}
  >
    <div data-qa="emptyPlaylistText">
      Save interesting videos to this playlist. Simply click the
      <PlaylistAddIcon className={s.addSvg} role="img" />
      button on any video to get started.
    </div>
  </div>
);

const PlaylistBody = ({ videos }: Props) => {
  return videos && videos.length === 0 ? (
    <Main>
      <EmptyPlaylist />
    </Main>
  ) : (
    <>
      <h4 className="grid-row-start-4 grid-row-end-4 col-start-2 col-end-26 mb-0">
        In this playlist:
      </h4>
      <Main>
        <div
          className={c(
            s.cardWrapper,
            'grid-row-start-5 grid-row-end-5 col-start-2 col-end-26',
          )}
        >
          {videos.map((video) => {
            return (
              <PlaylistCard
                link={`/videos/${video.id}`}
                key={video.id}
                name={video.title}
                header={<CoverWithVideo video={video} />}
                footer={buttons(video)}
              />
            );
          })}
        </div>
      </Main>
    </>
  );
};

export default PlaylistBody;
