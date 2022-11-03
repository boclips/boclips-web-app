import React, { useState } from 'react';
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
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(false);
  const inputTextRef = React.useRef();

  const hasErrors = () => {
    let hasErr = false;

    if (comment == null || comment.trim() === '') {
      setCommentError(true);
      hasErr = true;
    }

    return hasErr;
  };

  const createNewComment = (comm) => {
    if (!hasErrors()) {
      dispatch({
        action: 'add-comment',
        text: comm.trim(),
      });

      setComment('');
      onSectionCreated();
    }
  };

  return (
    <>
      <BoInputText
        id="comment-input"
        labelText="Comment"
        placeholder="Add comment..."
        constraints={{ required: true }}
        onChange={(input) => setComment(input)}
        isError={commentError}
        errorMessage="Comment is required"
        inputType="textarea"
        ref={inputTextRef}
      />
      <div className={s.buttons}>
        <Button
          text="Close"
          type="label"
          aria-label="Close the drawer"
          onClick={onClose}
        />
        <Button
          onClick={() => createNewComment(comment)}
          text="Add comment"
          aria-label="Add comment"
          width="120px"
          height="40px"
        />
      </div>
    </>
  );
};
