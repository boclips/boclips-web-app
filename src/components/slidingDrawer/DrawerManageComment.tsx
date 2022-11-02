import React, { useState } from 'react';
import c from 'classnames';
import { useMagicPlaylistContext } from 'src/components/common/providers/MagicPlaylistProvider';
import s from './SlidingDrawer.module.less';

interface Props {
  onSectionCreated: () => void;
}

export const DrawerManageComment = ({ onSectionCreated }: Props) => {
  const { dispatch } = useMagicPlaylistContext();
  const [commentTitle, setCommentTitle] = useState('');

  const createNewComment = (title) => {
    dispatch({
      action: 'add-comment',
      text: title,
    });
    setCommentTitle('');
    onSectionCreated();
  };

  return (
    <div className={c(s.drawerSearchResults)}>
      <textarea
        value={commentTitle}
        onChange={(e) => setCommentTitle(e.target.value)}
      />
      <button type="button" onClick={() => createNewComment(commentTitle)}>
        Add comment
      </button>
    </div>
  );
};
