import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import s from '@components/playlistModal/reorder/style.module.less';
import DragSVG from '@resources/icons/drag.svg?react';
import { Badge, Typography } from 'boclips-ui';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PlaylistVideosListDraggable = ({
  id,
  video: { bestFor, createdBy, title },
}: {
  id: string;
  video: Video;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      id={`item-${id}`}
      data-qa={`data-${id}`}
      ref={setNodeRef}
      style={style}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...attributes}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...listeners}
      className={s.draggableItem}
    >
      <DragSVG />
      <div>
        <Typography.Title2 as="h3">{title}</Typography.Title2>
        <div className={s.details}>
          {bestFor[0] && <Badge value={bestFor[0].label} />}
          <Typography.Body as="span" size="small" className={s.createdBy}>
            {createdBy}
          </Typography.Body>
        </div>
      </div>
    </li>
  );
};

export default PlaylistVideosListDraggable;
