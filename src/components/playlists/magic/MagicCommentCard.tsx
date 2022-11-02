import React, { useState } from 'react';
import { useMagicPlaylistContext } from 'src/components/common/providers/MagicPlaylistProvider';
import Button from '@boclips-ui/button';
import CloseIconSVG from 'src/resources/icons/cross-icon.svg';
import s from './style.module.less';

interface Props {
  text: string;
  visualComponentId: string;
}

export const MagicCommentCard = ({ text, visualComponentId }: Props) => {
  const { dispatch } = useMagicPlaylistContext();
  const [show, setShow] = useState(false);

  const onRemoveWidgetClicked = () => {
    dispatch({
      action: 'remove-widget',
      id: visualComponentId,
    });
  };

  const onMouseOver = () => {
    setShow(true);
  };

  const onMouseOut = () => {
    setShow(false);
  };

  return (
    <div
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      className={s.comment}
    >
      {text}
      {show && (
        <div className={s.sectionActions}>
          <Button
            width="24px"
            height="24px"
            type="outline"
            className={s.removeWidgetBtn}
            onClick={onRemoveWidgetClicked}
            iconOnly
            icon={<CloseIconSVG />}
          />
        </div>
      )}
    </div>
  );
};
