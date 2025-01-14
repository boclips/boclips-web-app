import React from 'react';
import s from 'src/components/videoCard/buttons/style.module.less';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import { DownloadTranscriptButton } from 'src/components/downloadTranscriptButton/DownloadTranscriptButton';
import PlaylistAssetBookmarkButton from 'src/components/playlists/buttons/playlistBookmark/PlaylistAssetBookmarkButton';
import PlaylistAssetNoteButton from 'src/components/playlists/buttons/playlistNote/PlaylistAssetNoteButton';
import { CollectionAsset } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionAsset';
import { assetIdString } from 'src/components/playlistModal/CollectionAssetIdString';

interface PlaylistVideoCardButtonsProps {
  asset: CollectionAsset;
  onAddToPlaylist?: () => void;
  onCleanupAddToPlaylist?: (playlistId: string, cleanUp: () => void) => void;
  additionalSecondaryButtons?: React.ReactElement;
  playlistId: string;
}

const PlaylistVideoCardButtons = ({
  asset,
  onAddToPlaylist,
  onCleanupAddToPlaylist,
  additionalSecondaryButtons,
  playlistId,
}: PlaylistVideoCardButtonsProps) => {
  const hasTranscript = asset?.video?.links?.transcript?.getOriginalLink();

  return (
    <div className={s.buttonsWrapper} key={`copy-${assetIdString(asset.id)}`}>
      <div className={s.iconOnlyButtons}>
        <AddToPlaylistButton
          videoId={asset.id.videoId}
          highlightId={asset.id.highlightId}
          onCleanup={onCleanupAddToPlaylist}
          onClick={onAddToPlaylist}
        />
        {hasTranscript && (
          <FeatureGate product={Product.CLASSROOM}>
            <DownloadTranscriptButton video={asset.video} />
          </FeatureGate>
        )}
        {additionalSecondaryButtons}
      </div>

      <div className="flex justify-between gap-2">
        <PlaylistAssetNoteButton
          selectedAsset={asset}
          playlistId={playlistId}
        />
        <PlaylistAssetBookmarkButton
          selectedAsset={asset}
          playlistId={playlistId}
        />
      </div>
    </div>
  );
};

export default PlaylistVideoCardButtons;
