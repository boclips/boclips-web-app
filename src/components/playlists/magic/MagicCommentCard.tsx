import React from 'react';
import { useMagicPlaylistContext } from 'src/components/common/providers/MagicPlaylistProvider';

interface Props {
  text: string;
  visualComponentId: string;
}

export const MagicCommentCard = ({ text, visualComponentId }: Props) => {
  const { dispatch } = useMagicPlaylistContext();

  const onRemoveWidgetClicked = () => {
    dispatch({
      action: 'remove-widget',
      id: visualComponentId,
    });
  };

  return (
    <div>
      <div>{text}</div>
      <div className="commentActions">
        <button type="button" onClick={onRemoveWidgetClicked}>
          Remove this widget
        </button>
      </div>
    </div>
  );
};
