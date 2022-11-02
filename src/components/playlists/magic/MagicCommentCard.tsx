import React from 'react';
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
        <Button
          className={s.removeWidgetBtn}
          onClick={onRemoveWidgetClicked}
          iconOnly
          icon={<CloseIconSVG />}
        />
      </div>
    </div>
  );
};
