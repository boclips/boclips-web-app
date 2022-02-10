import React from 'react';
import c from 'classnames';
import PlaylistCard from 'src/components/playlists/playlistCard/PlaylistCard';
import PlaylistAddIcon from 'src/resources/icons/playlist-add.svg';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import Thumbnail from 'src/components/playlists/playlistCard/Thumbnail';
import { FeatureGate } from 'src/components/common/FeatureGate';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import { AddToPlaylistButton } from 'src/components/videoCard/buttons/addToPlaylistButton/AddToPlaylistButton';
import s from './style.module.less';

interface Props {
  videos: Video[];
}

const PlaylistBody = ({ videos }: Props) => {
  const buttons = (video: Video) => (
    <div className="flex flex-row justify-between">
      <div className="p-1">
        <AddToPlaylistButton videoId={video.id} />
      </div>
      <div className="justify-end p-1">
        <FeatureGate linkName="cart">
          <AddToCartButton
            video={video}
            key="cart-button"
            width="120px"
            labelAdd="Add"
            appcueEvent={AppcuesEvent.ADD_TO_CART_FROM_PLAYLIST_PAGE}
          />
        </FeatureGate>
      </div>
    </div>
  );

  return videos && videos.length === 0 ? (
    <div
      className={c(
        s.emptyPlaylistWrapper,
        'grid-row-start-4 grid-row-end-4 col-start-2 col-end-26',
      )}
    >
      <div data-qa="emptyPlaylistText">
        Save interesting videos to this playlist. Simply click the
        <PlaylistAddIcon className={s.addSvg} role="img" />
        on any video card to get started.
      </div>
    </div>
  ) : (
    <>
      <h4 className="grid-row-start-4 grid-row-end-4 col-start-2 col-end-26 mb-0">
        In this playlist:
      </h4>
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
              name={video.title}
              key={video.id}
              header={<Thumbnail video={video} />}
              footer={buttons(video)}
            />
          );
        })}
      </div>
    </>
  );
};

export default PlaylistBody;
