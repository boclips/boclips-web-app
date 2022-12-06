import React, { useState } from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { Typography } from '@boclips-ui/typography';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Props {
  playlist: Collection;
  handleConfirm: (arg: any) => void;
  onCancel: () => void;
  confirmButtonText: string;
}

const RearrangeModal = ({
  handleConfirm,
  playlist,
  onCancel,
  confirmButtonText,
}: Props) => {
  const [list, setList] = useState<Video[]>([...playlist.videos]);

  const onConfirm = () => {
    handleConfirm('');
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
    >
      <Typography.Body as="span">
        Drag & drop video titles to put them in your desired order:
      </Typography.Body>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="vertical">
          {(provided) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {list.map((item, index) => (
                <Draggable
                  key={`${item.id}-key`}
                  draggableId={item.id}
                  index={index}
                >
                  {(providedOther) => (
                    <li
                      data-qa={`data-${item.id}`}
                      ref={providedOther.innerRef}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...providedOther.draggableProps}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...providedOther.dragHandleProps}
                    >
                      {item.title}
                    </li>
                  )}
                </Draggable>
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
