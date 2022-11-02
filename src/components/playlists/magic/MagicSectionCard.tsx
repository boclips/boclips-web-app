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

export const MagicSectionCard = ({ text, visualComponentId }: Props) => {
  const [show, setShow] = useState(false);

  const { dispatch } = useMagicPlaylistContext();

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
      className={s.section}
    >
      <Typography.H2>{text}</Typography.H2>
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
