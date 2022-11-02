import React, { useState } from 'react';
import c from 'classnames';
import { useMagicPlaylistContext } from 'src/components/common/providers/MagicPlaylistProvider';
import s from './SlidingDrawer.module.less';

interface Props {
  onSectionCreated: () => void;
}

export const DrawerManageSection = ({ onSectionCreated }: Props) => {
  const { dispatch } = useMagicPlaylistContext();
  const [commentTitle, setCommentTitle] = useState('');

  const createNewSection = (title) => {
    dispatch({
      action: 'add-comment',
      text: title,
    });
    setCommentTitle('');
    onSectionCreated();
  };

  return (
    <div className={c(s.drawerSearchResults)}>
      <input
        type="textarea"
        value={commentTitle}
        onChange={(e) => setCommentTitle(e.target.value)}
      />
      <button type="button" onClick={() => createNewSection(commentTitle)}>
        Add comment
      </button>
    </div>
  );
};
