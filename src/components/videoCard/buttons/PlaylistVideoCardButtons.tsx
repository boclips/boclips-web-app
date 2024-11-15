import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import React from 'react';
import s from '@src/components/videoCard/buttons/style.module.less';
import { AddToPlaylistButton } from '@src/components/addToPlaylistButton/AddToPlaylistButton';
import { FeatureGate } from '@src/components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { DownloadTranscriptButton } from '@src/components/downloadTranscriptButton/DownloadTranscriptButton';
import PlaylistVideoBookmarkButton from '@src/components/playlists/buttons/playlistBookmark/PlaylistVideoBookmarkButton';
import PlaylistVideoNoteButton from '@src/components/playlists/buttons/playlistNote/PlaylistVideoNoteButton';

interface PlaylistVideoCardButtonsProps {
  video: Video;
  onAddToPlaylist?: () => void;
  onCleanupAddToPlaylist?: (playlistId: string, cleanUp: () => void) => void;
  additionalSecondaryButtons?: React.ReactElement;
  playlistId: string;
}

const PlaylistVideoCardButtons = ({
  video,
  onAddToPlaylist,
  onCleanupAddToPlaylist,
  additionalSecondaryButtons,
  playlistId,
}: PlaylistVideoCardButtonsProps) => {
  const hasTranscript = video?.links?.transcript?.getOriginalLink();

  return (
    <div className={s.buttonsWrapper} key={`copy-${video.id}`}>
      <div className={s.iconOnlyButtons}>
        <AddToPlaylistButton
          videoId={video.id}
          onCleanup={onCleanupAddToPlaylist}
          onClick={onAddToPlaylist}
        />
        {hasTranscript && (
          <FeatureGate product={Product.CLASSROOM}>
            <DownloadTranscriptButton video={video} />
          </FeatureGate>
        )}
        {additionalSecondaryButtons}
      </div>

      <div className="flex justify-between gap-2">
        <PlaylistVideoNoteButton video={video} playlistId={playlistId} />
        <PlaylistVideoBookmarkButton video={video} playlistId={playlistId} />
      </div>
    </div>
  );
};

export default PlaylistVideoCardButtons;
