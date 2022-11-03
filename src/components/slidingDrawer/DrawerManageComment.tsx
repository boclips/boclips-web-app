import React, { useState } from 'react';
import c from 'classnames';
import { useMagicPlaylistContext } from 'src/components/common/providers/MagicPlaylistProvider';
import { BoInputText } from 'src/components/common/input/BoInputText';
import Button from '@boclips-ui/button';
import s from './SlidingDrawer.module.less';

interface Props {
  onSectionCreated: () => void;
  onClose: () => void;
}

export const DrawerManageComment = ({ onSectionCreated, onClose }: Props) => {
  const { dispatch } = useMagicPlaylistContext();
  const [commentTitle, setCommentTitle] = useState('');
  const [commentError, setCommentError] = useState(false);

  const hasErrors = () => {
    let hasErr = false;

    if (commentTitle == null || commentTitle.trim() === '') {
      setCommentError(true);
      hasErr = true;
    }

    return hasErr;
  };

  const createNewComment = (title) => {
    if (!hasErrors()) {
      dispatch({
        action: 'add-comment',
        text: title,
      });
      setCommentTitle('');
      onSectionCreated();
    }
  };

  return (
    <div className={c(s.drawerSearchResults)}>
      <BoInputText
        id="comment-input"
        labelText="Comment"
        placeholder="Add comment..."
        constraints={{ required: true, minLength: 5 }}
        onChange={(input) => setCommentTitle(input)}
        isError={commentError}
        errorMessage="Comment is required"
        inputType="textarea"
      />
      <div className={s.buttons}>
        <Button
          text="Close"
          type="label"
          aria-label="Close the drawer"
          onClick={onClose}
        />
        <Button
          onClick={() => createNewComment(commentTitle)}
          text="Add comment"
          aria-label="Add comment"
          width="120px"
          height="40px"
        />
      </div>
    </div>
  );
};
