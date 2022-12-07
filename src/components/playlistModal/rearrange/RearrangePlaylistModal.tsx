import React, { useRef, useState } from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Typography } from '@boclips-ui/typography';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import PlaylistVideosListDraggable from 'src/components/playlistModal/rearrange/PlaylistVideosListDraggable';
import { useEditPlaylistMutation } from 'src/hooks/api/playlistsQuery';
import s from './style.module.less';

interface Props {
  playlist: Collection;
  onCancel: () => void;
  confirmButtonText: string;
}

const RearrangeModal = ({ playlist, onCancel, confirmButtonText }: Props) => {
  const [list, setList] = useState<Video[]>([...playlist.videos]);
  const { mutate: editPlaylist } = useEditPlaylistMutation(playlist);
  const onConfirm = () => {
    const videos = list.map((it) => it.id);
    editPlaylist({ videos });
    onCancel();
  };

  const reorder = (array, startIndex, endIndex) => {
    const result = [...array];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(list, result.source.index, result.destination.index);

    setList(items);
  };

  return (
    <Bodal
      title="Rearrange videos"
      confirmButtonText={confirmButtonText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      dataQa="playlist-modal"
      initialFocusRef="first-reorder-item"
    >
      <Typography.Body as="span">
        Drag & drop video titles to put them in your desired order:
      </Typography.Body>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="vertical">
          {(provided) => (
            <ul
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={s.listWrapper}
            >
              {list.map((video, index) => (
                <PlaylistVideosListDraggable
                  key={video.id}
                  video={video}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </Bodal>
  );
};

export default RearrangeModal;
