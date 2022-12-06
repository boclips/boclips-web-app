import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { Draggable } from 'react-beautiful-dnd';
import s from 'src/components/playlistModal/rearrange/style.module.less';
import DragSVG from 'src/resources/icons/drag.svg';
import { Typography } from '@boclips-ui/typography';
import Badge from '@boclips-ui/badge';
import React from 'react';

const PlaylistVideosListDraggable = ({
  index,
  video: { bestFor, createdBy, id, title },
}: {
  index: number;
  video: Video;
}) => {
  return (
    <Draggable key={`${id}-key`} draggableId={id} index={index}>
      {({ dragHandleProps, draggableProps, innerRef }) => (
        <li
          data-qa={`data-${id}`}
          ref={innerRef}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...draggableProps}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...dragHandleProps}
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
      )}
    </Draggable>
  );
};

export default PlaylistVideosListDraggable;
