import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { VideoCardButtons } from 'src/components/videoCard/buttons/VideoCardButtons';
import { EditPedagogyTagButton } from 'src/components/playlists/magic/EditPedagogyTagButton';
import Tooltip from '@boclips-ui/tooltip';
import Button from '@boclips-ui/button';
import CloseIconSVG from 'src/resources/icons/cross-icon.svg';
import { useMagicPlaylistContext } from 'src/components/common/providers/MagicPlaylistProvider';
import { BestForTag } from 'boclips-api-client/dist/sub-clients/bestForTags/model/BestForTag';
import s from './style.module.less';

interface CardButtonsProps {
  video: Video;
  currentTag: BestForTag;
  tags: BestForTag[];
  visualComponentId: string;
  setTagCallback: (tag) => void;
}

export const PlaylistVideoCardButtons = ({
  video,
  currentTag,
  tags,
  visualComponentId,
  setTagCallback,
}: CardButtonsProps) => {
  const { dispatch } = useMagicPlaylistContext();

  const primaryButton = (
    <EditPedagogyTagButton
      video={video}
      currentTag={currentTag}
      tags={tags}
      setTagCallback={setTagCallback}
    />
  );

  const onRemoveWidgetClicked = () => {
    dispatch({
      action: 'remove-widget',
      id: visualComponentId,
    });
  };

  const removeWidgetButton = (
    <Tooltip text="Remove this widget">
      <Button
        iconOnly
        icon={<CloseIconSVG />}
        className={s.removeWidgetBtn}
        onClick={onRemoveWidgetClicked}
        type="outline"
        width="40px"
        height="40px"
      >
        Remove Widget
      </Button>
    </Tooltip>
  );

  return (
    <VideoCardButtons
      primaryButton={primaryButton}
      additionalSecondaryButtons={removeWidgetButton}
      video={video}
    />
  );
};
