import React, { useRef, useState } from 'react';
import { Clip } from 'boclips-api-client/dist/sub-clients/chat/model/Clip';
import { useFindOrGetVideo } from 'src/hooks/api/videoQuery';
import Thumbnail from 'src/components/playlists/thumbnails/Thumbnail';
import More from 'src/resources/icons/more.svg';
import CloseOnClickOutside from 'src/hooks/closeOnClickOutside';
import Button from '@boclips-ui/button';
import c from 'classnames';
import CloseButton from 'src/resources/icons/cross-icon.svg';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import { VideoShareLinkButton } from 'src/components/shareLinkButton/VideoShareLinkButton';
import { EmbedButton } from 'src/components/embedButton/EmbedButton';
import { Video } from 'boclips-api-client/dist/types';
import { FeatureGate } from 'src/components/common/FeatureGate';
import s from './style.module.less';

interface Props {
  clip: Clip;
  id: string;
}

const MoreButton = ({ clip, video }: { clip: Clip; video: Video }) => {
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
            />
            <VideoShareLinkButton video={video} iconOnly={false} />
            <EmbedButton
              video={video}
              initialSegment={{ start: clip.startTime, end: clip.endTime }}
              iconOnly={false}
              label="Embed"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const AnswerClip = ({ clip, id }: Props) => {
  const { data: video, isLoading } = useFindOrGetVideo(clip.videoId);

  const jumpToSectionWithId = (sectionId: string) => {
    document.querySelector(`#${sectionId}`).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  };

  return !isLoading ? (
    <div className={s.answer}>
      <div className={s.clipDetails}>
        <Thumbnail video={video} className={s.thumbnail} />
        <button
          onClick={() => jumpToSectionWithId(id)}
          className={s.answerClip}
          type="button"
        >
          {clip.clipName}
        </button>
      </div>
      <FeatureGate feature="BO_WEB_APP_DEV">
        <div className={s.more}>
          <MoreButton clip={clip} video={video} />
        </div>
      </FeatureGate>
    </div>
  ) : null;
};
