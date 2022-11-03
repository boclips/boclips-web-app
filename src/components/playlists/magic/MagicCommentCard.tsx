import React, { useState } from 'react';
import { useMagicPlaylistContext } from 'src/components/common/providers/MagicPlaylistProvider';
import Button from '@boclips-ui/button';
import CloseIconSVG from 'src/resources/icons/cross-icon.svg';
import { Typography } from '@boclips-ui/typography';
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
      <Typography.Body
        as="div"
        className={s.text}
      >
        {text}
      </Typography.Body>
      {show && (
        <div className={s.sectionActions}>
          <Button
            width="40px"
            height="40px"
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
