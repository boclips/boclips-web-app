import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';
import { Video } from 'boclips-api-client/dist/types';
import React, { useRef, useState } from 'react';
import CloseOnClickOutside from 'src/hooks/closeOnClickOutside';
import Button from '@boclips-ui/button';
import c from 'classnames';
import s from 'src/components/assistant/conversations/style.module.less';
import More from 'src/resources/icons/more.svg';
import CloseButton from 'src/resources/icons/cross-icon.svg';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import { VideoShareLinkButton } from 'src/components/shareLinkButton/VideoShareLinkButton';
import { EmbedButton } from 'src/components/embedButton/EmbedButton';

export const MoreActionsButton = ({
  clip,
  video,
}: {
  clip: Clip;
  video: Video;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonWrapperRef = useRef(null);

  CloseOnClickOutside(buttonWrapperRef, () => setIsOpen(false));

  return (
    <div ref={buttonWrapperRef}>
      <Button
        width="40px"
        height="40px"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={c({
          [s.active]: isOpen,
        })}
        iconOnly
        icon={<More />}
        type="label"
        text=""
      />
      {isOpen && (
        <div role="dialog" className={s.moreActions}>
          <button
            type="button"
            aria-label="close feedback options"
            onClick={() => setIsOpen(false)}
            className={s.close}
          >
            <CloseButton />
          </button>
          <div className={s.actionButtons}>
            <AddToPlaylistButton
              videoId={clip.videoId}
              iconOnly={false}
              outlineType={false}
              width="100%"
              height="auto"
            />
            <VideoShareLinkButton video={video} iconOnly={false} width="100%" />
            <EmbedButton
              video={video}
              initialSegment={{ start: clip.startTime, end: clip.endTime }}
              iconOnly={false}
              label="Embed"
              width="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
};
