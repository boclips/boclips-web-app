import React, { useState } from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Typography } from '@boclips-ui/typography';
import PlaylistAssetsListDraggable from 'src/components/playlistModal/reorder/PlaylistAssetsListDraggable';
import { useReorderPlaylist } from 'src/hooks/api/playlistsQuery';
import { usePlatformInteractedWithEvent } from 'src/hooks/usePlatformInteractedWithEvent';
import { CollectionAsset } from 'boclips-api-client/dist/sub-clients/collections/model/CollectionAsset';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { assetIdString } from 'src/components/playlistModal/CollectionAssetIdString';
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
        (item) => assetIdString(item.id) === active.id,
      );
      const newIndex = reorderedAssets.findIndex(
        (item) => assetIdString(item.id) === over?.id,
      );

      const newOrder = arrayMove(reorderedAssets, oldIndex, newIndex);
      setReorderedAssets(newOrder);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={reorderedAssets.map((asset) => assetIdString(asset.id))}
          strategy={verticalListSortingStrategy}
        >
          <ul className={s.listWrapper}>
            {reorderedAssets.map((asset) => (
              <PlaylistAssetsListDraggable
                key={assetIdString(asset.id)}
                id={assetIdString(asset.id)} // Pass the unique identifier
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
