import React, { useState } from 'react';
import Button from '@boclips-ui/button';
import CommentSVG from 'src/resources/icons/comment-icon.svg';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import Bubble from 'src/components/playlists/comments/Bubble';
import SliderPanel from 'src/components/playlists/comments/SliderPanel';
import c from 'classnames';
import { FeatureGate } from 'src/components/common/FeatureGate';
import s from './style.module.less';

type CommentButtonProps = {
  videoId: string;
  collection: Collection;
};
const CommentButton = ({ videoId, collection }: CommentButtonProps) => {
  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(false);
  const numberOfComments = collection.comments?.videos[videoId]?.length;

  return (
    collection?.mine && (
      <FeatureGate
        feature="BO_WEB_APP_ADD_COMMENT_TO_VIDEO_IN_COLLECTION"
        fallback={null}
      >
        <Button
          data-qa="add-comment-button"
          onClick={() => setIsSliderOpen(!isSliderOpen)}
          iconOnly
          icon={<CommentSVG />}
          type="outline"
          className={c(s.button, { [s.pointerEvent]: isSliderOpen })}
          width="40px"
          height="40px"
          suffix={numberOfComments && <Bubble number={numberOfComments} />}
        />
        {isSliderOpen && (
          <SliderPanel
            comments={
              numberOfComments ? collection.comments.videos[videoId] : []
            }
            closeSliderOnClick={() => setIsSliderOpen(false)}
            videoId={videoId}
            collection={collection}
          />
        )}
      </FeatureGate>
    )
  );
};

export default CommentButton;
