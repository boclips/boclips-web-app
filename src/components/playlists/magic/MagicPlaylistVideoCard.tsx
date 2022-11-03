import { Video } from 'boclips-api-client/dist/types';
import React, { useState } from 'react';
import { PlaylistVideoCardButtons } from 'src/components/playlists/magic/VideoPedagogyTagCardButtons';
import Badge from '@boclips-ui/badge';
import CoverWithVideo from 'src/components/playlists/coverWithVideo/CoverWithVideo';
import { useMagicPlaylistContext } from 'src/components/common/providers/MagicPlaylistProvider';
import Button from '@boclips-ui/button';
import CloseIconSVG from 'src/resources/icons/cross-icon.svg';
import s from './style.module.less';

interface Props {
  video: Video;
  id: string;
}

export const MagicPlaylistVideoCard = ({ video, id }: Props) => {
  const { dispatch } = useMagicPlaylistContext();

  const onRemoveWidgetClicked = () => {
    dispatch({
      action: 'remove-widget',
      id,
    });
  };

  const tags = [
    { id: '1', label: 'Brain break' },
    { id: '2', label: 'Context builder' },
    { id: '3', label: 'Experiment' },
    { id: '4', label: 'Explainer' },
    { id: '5', label: 'Hook' },
    { id: '6', label: 'Review' },
    { id: '7', label: 'Other' },
  ];

  const [showCloseBtn, setShowCloseBtn] = useState(false);
  const onMouseOver = () => {
    setShowCloseBtn(true);
  };

  const onMouseOut = () => {
    setShowCloseBtn(false);
  };

  const index = Math.floor(Math.random() * tags.length);
  const [tag, setTag] = useState(tags[index]);

  const saveTag = (t, vid) => {
    setTag(t);
    // save to DB if needed
    console.log(`saving tag '${t.label}' for video ${vid.id}`);
  };

  return (
    <div
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      className="flex flex-col"
    >
      {showCloseBtn && (
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
      <div
        style={{
          width: '100%',
          height: 'auto',
        }}
      >
        <CoverWithVideo video={video} onSegmentPlayed={() => null} />
      </div>
      <span className="pedagogy-tag">
        <Badge value={tag.label} />
      </span>
      <span>{video.title}</span>
      <PlaylistVideoCardButtons
        video={video}
        currentTag={tag}
        tags={tags}
        setTagCallback={(t) => saveTag(t, video)}
      />
    </div>
  );
};
