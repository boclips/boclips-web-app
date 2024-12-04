import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import {
  useAddCommentToVideo,
  useRemoveCommentFromPlaylistVideo,
} from '@src/hooks/api/playlistsQuery';
import { useGetUserQuery } from '@src/hooks/api/userQuery';
import React, { useRef, useState } from 'react';
import s from '@src/components/playlists/comments/style.module.less';
import Tooltip, { Button, Typography, InputText } from 'boclips-ui';
import CloseSVG from '@src/resources/icons/cross-icon.svg';
import AccountSVG from '@src/resources/icons/account-icon.svg';
import BinSVG from '@src/resources/icons/bin.svg';
import CloseOnClickOutside from '@src/hooks/closeOnClickOutside';
import c from 'classnames';
import Bubble from './Bubble';

type Props = {
  closeSliderOnClick: () => void;
  videoId: string;
  comments?: Array<{
    id: string;
    userId: string;
    name?: string;
    email: string;
    text: string;
    createdAt: string;
  }>;
  collection: Collection;
};

const SliderPanel = ({
  closeSliderOnClick,
  comments,
  videoId,
  collection,
}: Props) => {
  const { data: user, isLoading } = useGetUserQuery();
  const [comment, setComment] = useState<string>('');
  const { mutate: addCommentToVideo } = useAddCommentToVideo();
  const { mutate: removeCommentFromVideo } =
    useRemoveCommentFromPlaylistVideo(collection);
  const ref = useRef(null);
  const textareaRef = useRef(null);

  CloseOnClickOutside(ref, () => closeSliderOnClick());

  const addComment = () => {
    addCommentToVideo({
      playlist: collection,
      request: {
        videoId,
        name: `${user.firstName} ${user.lastName} `,
        email: user.email,
        text: comment,
      },
    });

    setComment('');
    textareaRef.current.value = '';
  };

  return (
    <aside
      ref={ref}
      className={s.sliderPanel}
      data-qa={`slider-panel-${videoId}`}
    >
      <section className={s.header}>
        <Typography.Body className={s.headerText} weight="medium">
          Comments <Bubble inline number={comments.length} />
        </Typography.Body>
        <Button
          onClick={closeSliderOnClick}
          icon={<CloseSVG />}
          iconOnly
          type="outline"
          height="24px"
          width="24px"
          data-qa="close-button"
        />
      </section>
      <section className={c(s.input, { [s.margin]: comment.length === 0 })}>
        <Typography.Body className={s.headerText} weight="medium">
          {collection.assets.find((it) => it.id === videoId)?.video?.title}
        </Typography.Body>
        <InputText
          ref={textareaRef}
          id={`${videoId}-comment`}
          inputType="textarea"
          onChange={(text) => setComment(text)}
          placeholder="Add a comment"
        />
        {comment.length > 0 && (
          <Button onClick={addComment} height="32px" text="Reply" />
        )}
      </section>
      <section className={s.body}>
        {comments.map((it) => {
          return (
            <div key={it.id} className={s.comment}>
              <div data-qa={it.id} className={s.commentHeader}>
                <div className={s.name}>
                  <AccountSVG />
                  <Typography.Body as="span" size="small" weight="medium">
                    {it.name}
                  </Typography.Body>
                </div>
                {!isLoading && it.userId === user.id && (
                  <div>
                    <Tooltip text="Remove comment">
                      <Button
                        text="Remove comment"
                        aria-label="remove-comment-button"
                        dataQa="remove-comment-button"
                        iconOnly
                        icon={<BinSVG className={s.removeCommentIcon} />}
                        onClick={() => removeCommentFromVideo(it.id)}
                        type="label"
                        width="18px"
                        height="18px"
                        className={s.removeCommentButton}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>
              <div className={s.date}>
                <Typography.Body as="span" size="small">
                  {it.createdAt}
                </Typography.Body>
              </div>
              <div>
                <Typography.Body>{it.text}</Typography.Body>
              </div>
            </div>
          );
        })}
      </section>
    </aside>
  );
};

export default SliderPanel;
