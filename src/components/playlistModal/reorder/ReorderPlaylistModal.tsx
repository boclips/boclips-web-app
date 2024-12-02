import React, { useState } from 'react';
import { Bodal } from '@components/common/bodal/Bodal';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Typography } from 'boclips-ui';
import PlaylistVideosListDraggable from '@components/playlistModal/reorder/PlaylistVideosListDraggable';
import { useReorderPlaylist } from '@src/hooks/api/playlistsQuery';
import { usePlatformInteractedWithEvent } from '@src/hooks/usePlatformInteractedWithEvent';
import { CollectionAsset } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionAsset';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { closestCenter, DndContext } from '@dnd-kit/core';
import s from './style.module.less';

interface Props {
  playlist: Collection;
  onCancel: () => void;
  confirmButtonText: string;
}

const ReorderModal = ({ playlist, onCancel, confirmButtonText }: Props) => {
  const [reorderedAssets, setReorderedAssets] = useState<CollectionAsset[]>([
    ...playlist.assets,
  ]);

  const { mutate: trackPlatformInteraction } = usePlatformInteractedWithEvent();
  const { mutate: reorderPlaylist } = useReorderPlaylist(playlist);

  const onConfirm = () => {
    reorderPlaylist(reorderedAssets);
    trackPlatformInteraction({ subtype: 'PLAYLIST_REORDERED' });
    onCancel();
  };

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = reorderedAssets.findIndex(
        (item) => item.id === active.id,
      );
      const newIndex = reorderedAssets.findIndex(
        (item) => item.id === over?.id,
      );

      const newOrder = arrayMove(reorderedAssets, oldIndex, newIndex);
      setReorderedAssets(newOrder);
    }
  };

  return (
    <Bodal
      title="Reorder videos"
      confirmButtonText={confirmButtonText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      dataQa="playlist-modal"
      initialFocusRef="first-reorder-item"
    >
      <Typography.Body as="span">
        Drag & drop video titles to put them in your desired order:
      </Typography.Body>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={reorderedAssets.map((asset) => asset.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className={s.listWrapper}>
            {reorderedAssets.map((asset) => (
              <PlaylistVideosListDraggable
                key={asset.id}
                id={asset.id} // Pass the unique identifier
                video={asset.video}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </Bodal>
  );
};

export default ReorderModal;
