import React from 'react';
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
  const { dispatch } = useMagicPlaylistContext();

  const onRemoveWidgetClicked = () => {
    dispatch({
      action: 'remove-widget',
      id: visualComponentId,
    });
  };

  return (
    <div className={s.section}>
      <Typography.H2>{text}</Typography.H2>
      <div className="sectionActions">
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
